const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const dns = require('dns');

// Force usage of Google DNS to bypass potential local DNS restrictions on SRV records
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    console.log('Using Google DNS for resolution');
} catch (e) {
    console.warn('Could not set custom DNS servers:', e.message);
}
const config = require('./config/env');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const serviceFactory = require('./services/serviceFactory');

// Import routes
const authRoutes = require('./routes/auth');
const complaintRoutes = require('./routes/complaints');
const dashboardRoutes = require('./routes/dashboard');

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
})); // Set security headers with cross-origin access for images
app.use(mongoSanitize()); // Prevent NoSQL injection

// CORS configuration
app.use(cors({
    origin: '*',
    credentials: false
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Ensure verifications directory exists
const verificationsPath = path.join(__dirname, 'uploads', 'verifications');
if (!fs.existsSync(verificationsPath)) {
    fs.mkdirSync(verificationsPath, { recursive: true });
}

// MongoDB connection with Atlas-optimized options
const mongooseOptions = {
    // Connection pool settings
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // How long to try selecting a server
    socketTimeoutMS: 45000, // How long to wait for a response
    // Retry settings
    retryWrites: true,
    w: 'majority'
};

// Validate connection string format
if (!config.MONGODB_URI) {
    console.error('ERROR: MONGODB_URI is not set in .env file');
    process.exit(1);
}

// Check if it's an Atlas connection string
const isAtlasConnection = config.MONGODB_URI.startsWith('mongodb+srv://');

if (isAtlasConnection) {
    console.log('Connecting to MongoDB Atlas...');
    // Remove port from connection string if present (Atlas SRV doesn't use ports)
    const cleanUri = config.MONGODB_URI.replace(/:\d+(\/|$)/, '$1');
    // Debug: Log URI (masked for security)
    const maskedUri = cleanUri.replace(/:([^:@]+)@/, ':****@');
    console.log('Connection URI:', maskedUri);
    mongoose.connect(cleanUri, mongooseOptions)
        .then(() => {
            console.log('✓ MongoDB Atlas connected successfully');
        })
        .catch((err) => {
            console.error('✗ MongoDB Atlas connection failed:');
            console.error('  Error:', err.message);
            console.error('\nTroubleshooting:');
            console.error('  1. Check your MONGODB_URI in .env file');
            console.error('  2. Format should be: mongodb+srv://username:password@cluster.mongodb.net/database');
            console.error('  3. If password contains special characters (@, :, /, #, [, ], ?), they must be URL-encoded:');
            console.error('     @ = %40, : = %3A, / = %2F, # = %23, [ = %5B, ] = %5D, ? = %3F');
            console.error('  4. Make sure your IP is whitelisted in Atlas Network Access (or use 0.0.0.0/0 for all IPs)');
            console.error('  5. Verify your username and password are correct in MongoDB Atlas');
            console.error('  6. Check if your cluster is running');
            console.error('  7. Ensure the database user has proper permissions');
            process.exit(1);
        });
} else {
    console.log('Connecting to local MongoDB...');
    mongoose.connect(config.MONGODB_URI, mongooseOptions)
        .then(() => {
            console.log('✓ Local MongoDB connected successfully');
        })
        .catch((err) => {
            console.error('✗ Local MongoDB connection failed:');
            console.error('  Error:', err.message);
            console.error('\nTroubleshooting:');
            console.error('  1. Make sure MongoDB is running locally');
            console.error('  2. Check your MONGODB_URI format: mongodb://localhost:27017/civiclens');
            process.exit(1);
        });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Service health check endpoint
app.get('/health/services', async (req, res) => {
    try {
        const health = await serviceFactory.performHealthCheck();
        const stats = serviceFactory.getServiceStats();

        res.json({
            success: true,
            health,
            stats,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Service health check failed',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// 404 handler for undefined routes
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = config.PORT || 5000;

// Initialize services before starting server
async function startServer() {
    try {
        console.log('Initializing AI and Location services...');
        const initResult = await serviceFactory.initialize();

        if (initResult.success) {
            console.log('✓ Services initialized successfully');
            if (initResult.warnings && initResult.warnings.length > 0) {
                console.log('⚠ Service warnings:');
                initResult.warnings.forEach(warning => console.log(`  - ${warning}`));
            }
        } else {
            console.warn('⚠ Service initialization failed, but server will continue with fallback behavior');
            console.warn(`  Error: ${initResult.error}`);
        }

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT} in ${config.NODE_ENV} mode`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err.message);
    // Gracefully shutdown services
    serviceFactory.shutdown().then(() => {
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.message);
    process.exit(1);
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully...');
    await serviceFactory.shutdown();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully...');
    await serviceFactory.shutdown();
    process.exit(0);
});

