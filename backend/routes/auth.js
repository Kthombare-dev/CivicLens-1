const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const config = require('../config/env');
const { authenticate } = require('../middleware/auth');
const { sendSuccess, sendError, sendConflict, sendServerError } = require('../utils/response');
const {
    registerValidation,
    loginValidation,
    updateProfileValidation,
    changePasswordValidation,
    forgotPasswordValidation,
    resetPasswordValidation
} = require('../middleware/validators');
const { loginLimiter, registerLimiter, forgotPasswordLimiter, resetPasswordLimiter } = require('../middleware/rateLimiter');
const { sendPasswordResetOTP } = require('../utils/emailService');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new citizen user
 * @access  Public
 */
router.post('/register', registerLimiter, registerValidation, async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Check if email already exists
        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail) {
            return sendConflict(res, 'Email already registered');
        }

        // Check if phone already exists
        const existingUserByPhone = await User.findOne({ phone });
        if (existingUserByPhone) {
            return sendConflict(res, 'Phone number already registered');
        }

        // Hash password with bcrypt (12 rounds for security)
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user (Always citizen role)
        const user = new User({
            name,
            email,
            phone,
            password: hashedPassword,
            role: 'citizen'
        });

        await user.save();

        // Generate JWT token
        const payload = {
            user: {
                id: user._id.toString(),
                role: user.role
            }
        };

        const token = jwt.sign(payload, config.JWT_SECRET, {
            expiresIn: config.JWT_EXPIRES_IN
        });

        // Return user data (password excluded via toJSON method)
        return sendSuccess(res, {
            token,
            user: user.toJSON()
        }, 201);

    } catch (error) {
        return sendServerError(res, 'Registration failed', error);
    }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', loginLimiter, loginValidation, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email (case-insensitive due to lowercase transform)
        const user = await User.findOne({ email });
        if (!user) {
            // Generic error message for security (don't reveal if email exists)
            return sendError(res, 'Invalid email or password', 400);
        }

        // Check if account is active
        if (!user.isActive) {
            return sendError(res, 'Account is inactive. Please contact support.', 403);
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // Generic error message for security
            return sendError(res, 'Invalid email or password', 400);
        }

        // Update lastLogin timestamp
        user.lastLogin = new Date();
        await user.save();

        // Generate JWT token
        const payload = {
            user: {
                id: user._id.toString(),
                role: user.role
            }
        };

        const token = jwt.sign(payload, config.JWT_SECRET, {
            expiresIn: config.JWT_EXPIRES_IN
        });

        // Return user data (password excluded via toJSON method)
        return sendSuccess(res, {
            token,
            user: user.toJSON()
        });

    } catch (error) {
        return sendServerError(res, 'Login failed', error);
    }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user
 * @access  Private
 */
router.get('/me', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return sendError(res, 'User not found', 404);
        }

        return sendSuccess(res, {
            user: user.toJSON()
        });

    } catch (error) {
        return sendServerError(res, 'Failed to fetch user profile', error);
    }
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile (name and/or phone)
 * @access  Private
 */
router.put('/profile', authenticate, updateProfileValidation, async (req, res) => {
    try {
        const { name, phone } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return sendError(res, 'User not found', 404);
        }

        // Check phone uniqueness if phone is being updated
        if (phone && phone !== user.phone) {
            const existingUser = await User.findOne({ phone });
            if (existingUser && existingUser._id.toString() !== req.user.id) {
                return sendConflict(res, 'Phone number already registered');
            }
            user.phone = phone;
        }

        // Update name if provided
        if (name) {
            user.name = name;
        }

        await user.save();

        return sendSuccess(res, {
            user: user.toJSON()
        });

    } catch (error) {
        return sendServerError(res, 'Failed to update profile', error);
    }
});

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.put('/change-password', authenticate, changePasswordValidation, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return sendError(res, 'User not found', 404);
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return sendError(res, 'Current password is incorrect', 400);
        }

        // Hash new password
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        return sendSuccess(res, {
            message: 'Password changed successfully'
        });

    } catch (error) {
        return sendServerError(res, 'Failed to change password', error);
    }
});

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset OTP
 * @access  Public
 */
router.post('/forgot-password', forgotPasswordLimiter, forgotPasswordValidation, async (req, res) => {
    try {
        const { email } = req.body;

        // Find user by email (include OTP fields with select)
        const user = await User.findOne({ email }).select('+resetPasswordOTP +resetPasswordExpires');
        
        // For security, always return success even if user doesn't exist
        // This prevents email enumeration attacks
        if (!user) {
            return sendSuccess(res, {
                message: 'If an account exists with this email, a password reset OTP has been sent.'
            });
        }

        // Check if account is active
        if (!user.isActive) {
            // Don't reveal account status for security
            return sendSuccess(res, {
                message: 'If an account exists with this email, a password reset OTP has been sent.'
            });
        }

        // Generate 6-digit OTP using crypto for better randomness
        const otp = crypto.randomInt(100000, 999999).toString();

        // Set OTP and expiration (15 minutes from now)
        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        await user.save();

        // Send OTP email
        try {
            await sendPasswordResetOTP(user.email, user.name, otp);
        } catch (emailError) {
            console.error('Failed to send password reset email:', emailError.message);
            // Clear the OTP if email fails
            user.resetPasswordOTP = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            
            return sendServerError(res, 'Failed to send password reset email. Please try again later.');
        }

        return sendSuccess(res, {
            message: 'If an account exists with this email, a password reset OTP has been sent.'
        });

    } catch (error) {
        return sendServerError(res, 'Password reset request failed', error);
    }
});

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password using OTP
 * @access  Public
 */
router.post('/reset-password', resetPasswordLimiter, resetPasswordValidation, async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        // Find user by email (include OTP fields)
        const user = await User.findOne({ email }).select('+resetPasswordOTP +resetPasswordExpires');
        
        if (!user) {
            return sendError(res, 'Invalid or expired OTP', 400);
        }

        // Check if OTP exists
        if (!user.resetPasswordOTP || !user.resetPasswordExpires) {
            return sendError(res, 'Invalid or expired OTP', 400);
        }

        // Check if OTP has expired
        if (new Date() > user.resetPasswordExpires) {
            // Clear expired OTP
            user.resetPasswordOTP = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            
            return sendError(res, 'OTP has expired. Please request a new one.', 400);
        }

        // Verify OTP matches
        if (user.resetPasswordOTP !== otp) {
            return sendError(res, 'Invalid or expired OTP', 400);
        }

        // Hash new password
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(newPassword, salt);

        // Clear OTP fields
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        return sendSuccess(res, {
            message: 'Password reset successful. You can now login with your new password.'
        });

    } catch (error) {
        return sendServerError(res, 'Password reset failed', error);
    }
});

module.exports = router;
