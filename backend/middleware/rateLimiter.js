const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for login endpoint
 * Prevents brute force attacks
 * 5 attempts per 15 minutes per IP
 */
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
    message: {
        success: false,
        message: 'Too many login attempts. Please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true // Don't count successful logins
});

/**
 * Rate limiter for register endpoint
 * Prevents spam registrations
 * 3 attempts per hour per IP
 */
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 requests per window
    message: {
        success: false,
        message: 'Too many registration attempts. Please try again after 1 hour.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

/**
 * Rate limiter for forgot password endpoint
 * Prevents abuse of password reset feature
 * 3 attempts per 15 minutes per IP
 */
const forgotPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // 3 requests per window
    message: {
        success: false,
        message: 'Too many password reset requests. Please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

/**
 * Rate limiter for reset password endpoint
 * Prevents brute force OTP attacks
 * 5 attempts per 15 minutes per IP
 */
const resetPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
    message: {
        success: false,
        message: 'Too many password reset attempts. Please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = {
    loginLimiter,
    registerLimiter,
    forgotPasswordLimiter,
    resetPasswordLimiter
};

