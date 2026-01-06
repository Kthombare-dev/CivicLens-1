const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        maxlength: 255,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid 10-digit phone number!`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    role: {
        type: String,
        enum: ['citizen', 'official', 'admin'],
        default: 'citizen',
    },
    ward: {
        type: String,
        // Only required if role is official, can be enforced in application logic
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    lastLogin: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    resetPasswordOTP: {
        type: String,
        select: false  // Don't include in queries by default
    },
    resetPasswordExpires: {
        type: Date,
        select: false
    }
}, {
    timestamps: false, // We're using createdAt manually
});

// Indexes for performance
// Note: email and phone already have indexes from unique: true, so we only add role index
UserSchema.index({ role: 1 });

// Remove password from JSON output
UserSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

module.exports = mongoose.model('User', UserSchema);
