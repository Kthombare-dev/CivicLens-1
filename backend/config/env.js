const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

/**
 * Validates required environment variables on startup
 * Throws error if any required variable is missing
 */
const requiredEnvVars = [
    'JWT_SECRET',
    'MONGODB_URI'
];

const optionalEnvVars = {
    'PORT': '5000',
    'NODE_ENV': 'development',
    'JWT_EXPIRES_IN': '7d',
    'CORS_ORIGIN': '*',
    'EMAIL_HOST': 'smtp.gmail.com',
    'EMAIL_PORT': '587',
    'EMAIL_USER': '',
    'EMAIL_PASSWORD': '',
    'EMAIL_FROM': 'CivicLens <noreply@civiclens.com>'
};

function validateEnv() {
    const missing = [];
    
    requiredEnvVars.forEach(varName => {
        if (!process.env[varName]) {
            missing.push(varName);
        }
    });
    
    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missing.join(', ')}\n` +
            'Please create a .env file with these variables.'
        );
    }
    
    // Set optional defaults
    Object.keys(optionalEnvVars).forEach(varName => {
        if (!process.env[varName]) {
            process.env[varName] = optionalEnvVars[varName];
        }
    });
    
    // Validate JWT_SECRET strength in production
    if (process.env.NODE_ENV === 'production' && process.env.JWT_SECRET.length < 32) {
        throw new Error('JWT_SECRET must be at least 32 characters in production');
    }
}

// Run validation
validateEnv();

module.exports = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: process.env.EMAIL_PORT,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    EMAIL_FROM: process.env.EMAIL_FROM
};

