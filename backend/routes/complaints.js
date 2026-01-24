const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { authenticate } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { analyzeComplaintImage, normalizeDepartment } = require('../services/complaintAI');

const fs = require('fs');

// POST /api/complaints/analyze - Analyze image for pre-filling form
router.post('/analyze', authenticate, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Image is required' });
        }

        // Run AI analysis
        const aiResult = await analyzeComplaintImage({
            filePath: req.file.path,
            mimeType: req.file.mimetype,
            userDescription: "Analyze this civic issue image" // Generic prompt for analysis
        });

        // Clean up the temp file since we'll re-upload or use a different flow for final submission
        // For this "Step 1" analysis, we don't want to keep the file forever if they abandon
        // Wait... if we delete it, we can't use it for the final submission if we wanted to pass the filename.
        // But the user plan is "upload image first then... populate fields". 
        // We will assume the frontend sends the file AGAIN on final submit.
        // So safe to delete this temporary analysis file to save space.
        try {
            fs.unlinkSync(req.file.path);
        } catch (cleanupErr) {
            console.error('Failed to cleanup temp analysis file:', cleanupErr);
        }

        res.json({
            title: aiResult.metadata?.suggestedTitle || aiResult.category + " Issue",
            description: aiResult.description,
            category: aiResult.category,
            priority: aiResult.priority,
            department: normalizeDepartment(aiResult.department),
            confidence: aiResult.confidence,
            estimatedResolutionTime: aiResult.estimatedResolutionTime
        });

    } catch (err) {
        console.error('Analysis failed:', err);
        res.status(500).json({ message: 'Failed to analyze image' });
    }
});

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

        // Calculate expected resolution date
        const estimatedDays = aiResult.estimatedDays || 3;
        const expectedResolutionDate = new Date();
        expectedResolutionDate.setDate(expectedResolutionDate.getDate() + estimatedDays);

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
            expectedResolutionDate,
            ai: {
                description: aiResult.description,
                category: aiResult.category,
                priority: aiResult.priority,
                department,
                estimatedResolutionTime: aiResult.estimatedResolutionTime,
                confidence: aiResult.confidence,
                metadata: aiResult.metadata,
                processingTime: aiResult.processingTime,
                fallback: aiResult.fallback || false
            },
            timeline: [{
                status: 'Assigned',
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

// GET /api/complaints - Get all (Public/Feed) or Filter by Citizen
router.get('/', async (req, res) => {
    try {
        const { citizen_id, department, status } = req.query;
        const query = {};

        // Build query based on filters
        if (citizen_id) {
            // Validate ObjectId
            if (!citizen_id.match(/^[0-9a-fA-F]{24}$/)) {
                // If invalid ID, and we are filtering strictly by it, return empty or error?
                // Better to return empty list if filtering by specific user ID that is invalid
                return res.json([]);
            }
            query.citizen_id = citizen_id;
        }

        if (department) query.department = department;
        if (status) query['timeline.status'] = status;

        const complaints = await Complaint.find(query)
            .sort({ createdAt: -1 })
            .lean(); // Performance: return plain JS objects

        res.json(complaints);
    } catch (err) {
        console.error('Error fetching complaints:', err);
        res.status(500).json({ message: 'Failed to retrieve complaints' });
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
