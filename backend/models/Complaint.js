const mongoose = require('mongoose');

const DEPARTMENTS = [
    'WASTE_MANAGEMENT',
    'ROAD_INFRASTRUCTURE',
    'STREETLIGHT_ELECTRICAL',
    'WATER_SEWERAGE',
    'SANITATION_PUBLIC_HEALTH',
    'PARKS_GARDENS',
    'ENCROACHMENT',
    'TRAFFIC_SIGNAGE',
    'GENERAL'
];

const ComplaintSchema = new mongoose.Schema({
    citizen_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String}, // Lat/Lng string or object
    address: { type: String, required: true}, // Human readable address

    images: [{ type: String }], // Public paths to stored images. Index 0 = Before. Index 1 = After (if resolved)

    status: {
        type: String,
        enum: ['Submitted', 'In Progress', 'Resolved', 'Rejected'],
        default: 'Submitted',
    },

    // AI Fields
    category: { type: String, default: 'Uncategorized' },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    department: { type: String, enum: DEPARTMENTS, default: 'GENERAL' },

    // AI outputs
    ai: {
        description: String,
        category: String,
        priority: String,
        department: { type: String, enum: DEPARTMENTS, default: 'GENERAL' },
        confidence: {
            description: { type: Number, default: 0 },
            category: { type: Number, default: 0 },
            priority: { type: Number, default: 0 },
        },
        metadata: Object,
        processingTime: Number,
        fallback: { type: Boolean, default: false }
    },

    // Community Validation
    votes: { type: Number, default: 0 },
    verifiedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who verified the fix

    // Lifecycle
    timeline: [{
        status: String,
        timestamp: { type: Date, default: Date.now },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        note: String
    }],

    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
