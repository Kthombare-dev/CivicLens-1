const { sendServerError, sendError } = require('../utils/response');

/**
 * Centralized error handling middleware
 * Catches all errors and sends consistent error responses
 */
const errorHandler = (err, req, res, next) => {
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => ({
            field: e.path,
            message: e.message
        }));
        return sendError(res, 'Validation failed', 400, errors);
    }
    
    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return sendError(
            res,
            `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
            409
        );
    }
    
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return sendError(res, 'Invalid token', 401);
    }
    
    if (err.name === 'TokenExpiredError') {
        return sendError(res, 'Token expired', 401);
    }
    
    // Cast error (invalid ObjectId, etc.)
    if (err.name === 'CastError') {
        return sendError(res, 'Invalid ID format', 400);
    }
    
    // Default server error
    const message = process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : err.message;
    
    return sendServerError(res, message, err);
};

/**
 * 404 handler for undefined routes
 */
const notFoundHandler = (req, res) => {
    return sendError(res, `Route ${req.originalUrl} not found`, 404);
};

module.exports = {
    errorHandler,
    notFoundHandler
};

