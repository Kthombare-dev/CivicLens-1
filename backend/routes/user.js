const express = require('express');
const router = express.Router();
const multer = require('multer');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');
const { sendSuccess, sendError, sendConflict, sendServerError } = require('../utils/response');
const { updateProfileValidation } = require('../middleware/validators');

/**
 * @route   PATCH /api/user/profile
 * @desc    Update user profile (name, phone, address, area)
 * @access  Private
 */
const upload = multer();
router.patch('/profile', authenticate, upload.none(), updateProfileValidation, async (req, res) => {
    try {
        const { name, phone, address, area } = req.body;
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

        // Update other fields if provided
        if (name) user.name = name;
        if (address !== undefined) user.address = address; // Allow clearing address with empty string or null? Validator trims so empty string might mean clear.
        if (area !== undefined) user.area = area;

        // Handle coordinates (latitude, longitude)
        const { latitude, longitude } = req.body;
        if (latitude !== undefined && longitude !== undefined) {
            const lat = parseFloat(latitude);
            const lng = parseFloat(longitude);

            if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
                user.coordinates = {
                    type: 'Point',
                    coordinates: [lng, lat] // GeoJSON is [longitude, latitude]
                };
            } else if (latitude === '' && longitude === '') {
                // Allow clearing coordinates
                user.coordinates = undefined;
            }
        }

        await user.save();

        return sendSuccess(res, {
            user: user.toJSON()
        });

    } catch (error) {
        return sendServerError(res, 'Failed to update profile', error);
    }
});

module.exports = router;
