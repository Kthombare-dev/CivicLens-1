const mongoose = require('mongoose');

const PointTransactionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    points: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['complaint_reported', 'complaint_verified', 'other'],
        required: true,
        index: true
    },
    description: {
        type: String,
        required: true
    },
    related_complaint_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Complaint',
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: false // We're using createdAt manually
});

// Compound index for efficient user queries sorted by date
PointTransactionSchema.index({ user_id: 1, createdAt: -1 });

// Index for complaint-related queries
PointTransactionSchema.index({ related_complaint_id: 1 });

module.exports = mongoose.model('PointTransaction', PointTransactionSchema);
