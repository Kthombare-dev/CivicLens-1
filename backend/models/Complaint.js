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
    location: { type: String }, // Lat/Lng string or object (legacy)
    address: { type: String, required: true }, // Human readable address
    // GeoJSON for smart nearby filtering (optional; set only when lat,lng available - no defaults to avoid invalid Point)
    coordinates: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: [Number] // [longitude, latitude] - required when type is Point
    },
    // Normalized area name (e.g. first part of address) for fast area-based filtering
    area: { type: String, trim: true, default: null },

    images: [{ type: String }], // Public paths to stored images. Index 0 = Before. Index 1 = After (if resolved)

    status: {
        type: String,
        enum: ['Submitted', 'Assigned', 'In Progress', 'Resolved', 'Rejected'],
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
        estimatedResolutionTime: String, // "3 days", "1 week"
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
    votedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who voted/liked

    // Comments
    commentCount: { type: Number, default: 0 },

    // Engagement & Trending
    engagementScore: { type: Number, default: 0 }, // Calculated: votes + (comments * 2) + (views * 0.1)
    trendScore: { type: Number, default: 0 }, // Time-weighted engagement score
    lastEngagementAt: { type: Date, default: Date.now }, // Last time someone interacted
    isTrending: { type: Boolean, default: false }, // Auto-set based on trendScore
    priorityBoost: { type: Number, default: 0 }, // Auto-escalation boost (0-2 levels)

    expectedResolutionDate: { type: Date }, // Calculated based on AI estimate
    verifiedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who verified the fix

    // Verification System
    verificationSubmissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VerificationSubmission'
    }],
    verificationCount: { type: Number, default: 0 }, // Number of approved verifications
    trustScore: { type: Number, default: 0, min: 0, max: 100 }, // Overall trust score based on verifications
    isVerified: { type: Boolean, default: false }, // True if has minimum required verifications

    // Lifecycle
    timeline: [{
        status: String,
        timestamp: { type: Date, default: Date.now },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        note: String
    }],

    createdAt: { type: Date, default: Date.now },
});

// Never persist incomplete GeoJSON Point (would break 2dsphere index)
ComplaintSchema.pre('save', function () {
    if (this.coordinates && this.coordinates.type === 'Point') {
        const arr = this.coordinates.coordinates;
        if (!Array.isArray(arr) || arr.length !== 2 || typeof arr[0] !== 'number' || typeof arr[1] !== 'number') {
            this.coordinates = undefined;
        }
    }
});

// Indexes for smart public-feed filtering
ComplaintSchema.index({ status: 1, trendScore: -1, engagementScore: -1, createdAt: -1 });
ComplaintSchema.index({ status: 1, area: 1, createdAt: -1 });
ComplaintSchema.index({ status: 1, citizen_id: 1, createdAt: -1 });
ComplaintSchema.index({ coordinates: '2dsphere' }, { sparse: true }); // only when coordinates exist

module.exports = mongoose.model('Complaint', ComplaintSchema);
