const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { sendUnauthorized } = require('../utils/response');
const User = require('../models/User');

/**
 * JWT Authentication Middleware
 * Extracts and verifies JWT token from request headers
 * Supports both 'x-auth-token' and 'Authorization: Bearer' headers
 */
const authenticate = async (req, res, next) => {
    try {
        // Try to get token from custom header first
        let token = req.header('x-auth-token');
        
        // If not found, try Authorization Bearer header
        if (!token && req.header('authorization')) {
            const authHeader = req.header('authorization');
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }
        
        if (!token) {
            return sendUnauthorized(res, 'No token provided. Authorization denied.');
        }
        
        // Verify token
        const decoded = jwt.verify(token, config.JWT_SECRET);
        
        // Attach user info to request
        req.user = decoded.user;
        
        // Optionally fetch full user from DB (for additional checks)
        // For now, we'll use the decoded token data for performance
        // Uncomment below if you need to verify user still exists/isActive
        /*
        const user = await User.findById(decoded.user.id).select('-password');
        if (!user) {
            return sendUnauthorized(res, 'User not found. Token invalid.');
        }
        if (user.isActive === false) {
            return sendUnauthorized(res, 'Account is inactive.');
        }
        req.user = {
            id: user._id.toString(),
            role: user.role,
            email: user.email
        };
        */
        
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return sendUnauthorized(res, 'Token expired. Please login again.');
        }
        if (error.name === 'JsonWebTokenError') {
            return sendUnauthorized(res, 'Invalid token. Authorization denied.');
        }
        return sendUnauthorized(res, 'Token verification failed.');
    }
};

module.exports = {
    authenticate
};

