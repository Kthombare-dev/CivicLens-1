const mongoose = require('mongoose');

const VerificationSubmissionSchema = new mongoose.Schema({
    complaint_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Complaint',
        required: true,
        index: true
    },
    verifier_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    verification_image: {
        type: String,
        required: true // Path to uploaded verification image
    },
    verification_location: {
        type: String, // Lat/Lng string for proximity validation
        required: false
    },
    verification_address: {
        type: String, // Human readable address where verification was done
        required: false
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    // Trust metrics
    isTrusted: {
        type: Boolean,
        default: false
    },
    trustScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    // Admin review
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    reviewNote: {
        type: String,
        default: null
    },
    reviewedAt: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: false
});

// Compound index to prevent duplicate verifications
VerificationSubmissionSchema.index({ complaint_id: 1, verifier_id: 1 }, { unique: true });

// Index for querying verifications by complaint
VerificationSubmissionSchema.index({ complaint_id: 1, status: 1 });

module.exports = mongoose.model('VerificationSubmission', VerificationSubmissionSchema);
