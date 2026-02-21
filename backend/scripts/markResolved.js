const mongoose = require('mongoose');
const Complaint = require('../models/Complaint');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Usage: node markResolved.js <COMPLAINT_ID>

const complaintId = process.argv[2];

if (!complaintId) {
    console.error('Please provide a Complaint ID as an argument.');
    process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        try {
            const result = await Complaint.findByIdAndUpdate(
                complaintId,
                { status: 'Resolved' },
                { new: true }
            );

            if (result) {
                console.log(`Success! Complaint ${complaintId} is now 'Resolved'.`);
                console.log('You can now use the "Verify" tab in the frontend to test verification.');
            } else {
                console.log('Complaint not found.');
            }
        } catch (error) {
            console.error('Error updating complaint:', error);
        } finally {
            mongoose.disconnect();
        }
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });
