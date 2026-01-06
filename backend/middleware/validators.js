const { body, validationResult } = require('express-validator');

/**
 * Validation middleware that checks for validation errors
 * Must be called after express-validator rules
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path || err.param,
                message: err.msg
            }))
        });
    }
    next();
};

/**
 * Register validation rules
 */
const registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z0-9\s\-]+$/).withMessage('Name can only contain letters, numbers, spaces, and hyphens'),
    
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .isLength({ max: 255 }).withMessage('Email must not exceed 255 characters')
        .normalizeEmail(), // Converts to lowercase
    
    body('phone')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .isLength({ min: 10, max: 10 }).withMessage('Phone number must be exactly 10 digits')
        .isNumeric().withMessage('Phone number must contain only digits'),
    
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8, max: 128 }).withMessage('Password must be between 8 and 128 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/).withMessage(
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)'
        ),
    
    validate
];

/**
 * Login validation rules
 */
const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),
    
    body('password')
        .notEmpty().withMessage('Password is required'),
    
    validate
];

/**
 * Update profile validation rules
 */
const updateProfileValidation = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z0-9\s\-]+$/).withMessage('Name can only contain letters, numbers, spaces, and hyphens'),
    
    body('phone')
        .optional()
        .trim()
        .isLength({ min: 10, max: 10 }).withMessage('Phone number must be exactly 10 digits')
        .isNumeric().withMessage('Phone number must contain only digits'),
    
    body()
        .custom((value) => {
            // At least one field must be provided
            if (!value.name && !value.phone) {
                throw new Error('At least one field (name or phone) must be provided');
            }
            return true;
        }),
    
    validate
];

/**
 * Change password validation rules
 */
const changePasswordValidation = [
    body('currentPassword')
        .notEmpty().withMessage('Current password is required'),
    
    body('newPassword')
        .notEmpty().withMessage('New password is required')
        .isLength({ min: 8, max: 128 }).withMessage('Password must be between 8 and 128 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/).withMessage(
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)'
        ),
    
    body()
        .custom((value) => {
            // New password must be different from current password
            if (value.currentPassword === value.newPassword) {
                throw new Error('New password must be different from current password');
            }
            return true;
        }),
    
    validate
];

/**
 * Forgot password validation rules
 */
const forgotPasswordValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),
    
    validate
];

/**
 * Reset password validation rules
 */
const resetPasswordValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),
    
    body('otp')
        .trim()
        .notEmpty().withMessage('OTP is required')
        .isLength({ min: 6, max: 6 }).withMessage('OTP must be exactly 6 digits')
        .isNumeric().withMessage('OTP must contain only digits'),
    
    body('newPassword')
        .notEmpty().withMessage('New password is required')
        .isLength({ min: 8, max: 128 }).withMessage('Password must be between 8 and 128 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/).withMessage(
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)'
        ),
    
    validate
];

module.exports = {
    registerValidation,
    loginValidation,
    updateProfileValidation,
    changePasswordValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
    validate
};

