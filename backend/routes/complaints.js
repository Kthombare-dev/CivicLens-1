const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { authenticate } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { analyzeComplaintImage, normalizeDepartment } = require('../services/complaintAI');

// POST /api/complaints - Create new complaint (Citizen)
router.post('/', authenticate, upload.single('image'), async (req, res) => {
    try {
        const { title, location, address, description: userDescription } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Image is required' });
        }
        // if (!location) {
        //     return res.status(400).json({ message: 'Location is required' });
        // }

        // Build public path for the stored image
        const imagePath = `/uploads/complaints/${req.file.filename}`;

        // Run AI analysis (fallbacks handled internally)
        const aiResult = await analyzeComplaintImage({
            filePath: req.file.path,
            mimeType: req.file.mimetype,
            userDescription: userDescription || title
        });

        // Ensure we always persist a description
        const finalDescription = aiResult.description || userDescription || 'Complaint description pending AI';
        const department = normalizeDepartment(aiResult.department);

        const newComplaint = new Complaint({
            citizen_id: req.user.id,
            title,
            description: finalDescription,
            location,
            address,
            images: [imagePath],
            category: aiResult.category || 'Other',
            priority: aiResult.priority || 'Medium',
            department,
            ai: {
                description: aiResult.description,
                category: aiResult.category,
                priority: aiResult.priority,
                department,
                confidence: aiResult.confidence,
                metadata: aiResult.metadata,
                processingTime: aiResult.processingTime,
                fallback: aiResult.fallback || false
            },
            timeline: [{
                status: 'Submitted',
                updatedBy: req.user.id,
                note: 'Complaint created'
            }]
        });

        const savedComplaint = await newComplaint.save();
        res.status(201).json(savedComplaint);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/complaints - Get all (Public/Feed)
router.get('/', async (req, res) => {
    try {
        const complaints = await Complaint.find().sort({ createdAt: -1 });
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /api/complaints/:id/vote - Upvote (Public - Requires Auth)
router.put('/:id/vote', authenticate, async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

        // Simple increment for now. Real world: track who voted to prevent doubles
        complaint.votes += 1;
        await complaint.save();
        res.json(complaint);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/complaints/:id - Get single complaint
router.get('/:id', async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
        res.json(complaint);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
