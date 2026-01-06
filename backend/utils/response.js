/**
 * Standardized response helpers for consistent API responses
 */

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {Object} data - Data to send
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const sendSuccess = (res, data, statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        data
    });
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 400)
 * @param {Array} errors - Array of field-specific errors (optional)
 */
const sendError = (res, message, statusCode = 400, errors = null) => {
    const response = {
        success: false,
        message
    };
    
    if (errors && Array.isArray(errors) && errors.length > 0) {
        response.errors = errors;
    }
    
    return res.status(statusCode).json(response);
};

/**
 * Send validation error response
 * @param {Object} res - Express response object
 * @param {Array} validationErrors - Array of validation errors from express-validator
 */
const sendValidationError = (res, validationErrors) => {
    const errors = validationErrors.map(err => ({
        field: err.path || err.param,
        message: err.msg
    }));
    
    return sendError(res, 'Validation failed', 400, errors);
};

/**
 * Send unauthorized error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message (default: 'Unauthorized')
 */
const sendUnauthorized = (res, message = 'Unauthorized') => {
    return sendError(res, message, 401);
};

/**
 * Send not found error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message (default: 'Resource not found')
 */
const sendNotFound = (res, message = 'Resource not found') => {
    return sendError(res, message, 404);
};

/**
 * Send conflict error response (e.g., duplicate email)
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
const sendConflict = (res, message) => {
    return sendError(res, message, 409);
};

/**
 * Send server error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message (default: 'Internal server error')
 * @param {Error} error - Error object for logging (optional)
 */
const sendServerError = (res, message = 'Internal server error', error = null) => {
    if (error && process.env.NODE_ENV === 'development') {
        console.error('Server Error:', error);
    }
    return sendError(res, message, 500);
};

module.exports = {
    sendSuccess,
    sendError,
    sendValidationError,
    sendUnauthorized,
    sendNotFound,
    sendConflict,
    sendServerError
};

