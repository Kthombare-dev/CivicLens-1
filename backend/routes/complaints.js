const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Complaint = require('../models/Complaint');
const PointTransaction = require('../models/PointTransaction');
const VerificationSubmission = require('../models/VerificationSubmission');
const Comment = require('../models/Comment');
const User = require('../models/User');
const { authenticate, requireRole } = require('../middleware/auth');
const { upload, verificationUpload } = require('../middleware/upload');
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

        // Address Fallback Logic
        let finalAddress = address;
        let finalLocation = location;
        let finalCoordinates = undefined;
        let finalArea = null;

        // If address is missing, try to fetch from user profile
        if (!finalAddress) {
            const user = await User.findById(req.user.id);
            if (user.address) {
                finalAddress = user.address;
                finalArea = user.area; // Trust user's area if using their address

                // Also use user coordinates if available and request didn't provide any
                if (user.coordinates && user.coordinates.coordinates && !finalLocation) {
                    finalCoordinates = user.coordinates;
                    // Reverse construct location string if needed, though coordinates object is what matters
                    finalLocation = `${user.coordinates.coordinates[1]}, ${user.coordinates.coordinates[0]}`;
                }
            } else {
                return res.status(400).json({
                    message: 'Address is required. Please provide it or update your profile with a home address.'
                });
            }
        }

        // Parse coordinates from location string if not already set from user profile
        if (!finalCoordinates && finalLocation && typeof finalLocation === 'string') {
            const parts = finalLocation.split(',').map(s => parseFloat(s.trim()));
            if (parts.length >= 2 && !Number.isNaN(parts[0]) && !Number.isNaN(parts[1])) {
                const lat = parts[0];
                const lng = parts[1];
                if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
                    finalCoordinates = { type: 'Point', coordinates: [lng, lat] }; // GeoJSON: [lng, lat]
                }
            }
        }

        // Extract area from address if not already set
        if (!finalArea && finalAddress && typeof finalAddress === 'string') {
            const trimmed = finalAddress.trim();
            const invalidStarts = ['detecting', 'location not available', 'add location', 'enter location', ''];
            if (trimmed && !invalidStarts.some(p => trimmed.toLowerCase().startsWith(p))) {
                const firstPart = trimmed.split(',')[0].trim();
                if (firstPart && firstPart.length <= 120) finalArea = firstPart;
            }
        }



        const newComplaint = new Complaint({
            citizen_id: req.user.id,
            title,
            description: finalDescription,
            location: finalLocation,
            address: finalAddress,
            ...(finalCoordinates ? { coordinates: finalCoordinates } : {}),
            ...(finalArea ? { area: finalArea } : {}),
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

        // Award 10 points for reporting a complaint
        const categoryName = aiResult.category || 'Other';
        const pointTransaction = new PointTransaction({
            user_id: req.user.id,
            points: 10,
            type: 'complaint_reported',
            description: `${categoryName} issue reported`,
            related_complaint_id: savedComplaint._id
        });
        await pointTransaction.save();

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
        if (status) query.status = status; // Fixed: use status field directly, not timeline.status

        // Sorting options
        const sortBy = req.query.sortBy || 'recent'; // 'recent', 'trending', 'engagement'
        let sortOption = { createdAt: -1 };

        if (sortBy === 'trending') {
            sortOption = { trendScore: -1, engagementScore: -1, createdAt: -1 };
        } else if (sortBy === 'engagement') {
            sortOption = { engagementScore: -1, trendScore: -1, createdAt: -1 };
        }

        const complaints = await Complaint.find(query)
            .sort(sortOption)
            .lean(); // Performance: return plain JS objects

        res.json(complaints);
    } catch (err) {
        console.error('Error fetching complaints:', err);
        res.status(500).json({ message: 'Failed to retrieve complaints' });
    }
});

// PUT /api/complaints/:id/vote - Like/Upvote (Public - Requires Auth)
router.put('/:id/vote', authenticate, async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

        const userId = req.user.id;
        const userIdObjectId = new mongoose.Types.ObjectId(userId);

        // Check if user already voted
        if (!complaint.votedBy) {
            complaint.votedBy = [];
        }

        const hasVoted = complaint.votedBy.some(id => id.toString() === userId);

        if (hasVoted) {
            // Unlike: remove vote
            complaint.votedBy = complaint.votedBy.filter(id => id.toString() !== userId);
            complaint.votes = Math.max(0, complaint.votes - 1);
        } else {
            // Like: add vote
            complaint.votedBy.push(userIdObjectId);
            complaint.votes += 1;
        }

        // Update engagement metrics
        await updateEngagementMetrics(complaint);
        await complaint.save();

        res.json({
            complaint: complaint,
            hasVoted: !hasVoted
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/complaints/:id/comments - Add comment
router.post('/:id/comments', authenticate, async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ message: 'Comment text is required' });
        }

        if (text.length > 500) {
            return res.status(400).json({ message: 'Comment must be 500 characters or less' });
        }

        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        const userId = req.user.id;

        // Create comment
        const comment = new Comment({
            complaint_id: complaint._id,
            user_id: userId,
            text: text.trim()
        });

        await comment.save();

        // Update complaint comment count
        complaint.commentCount = (complaint.commentCount || 0) + 1;

        // Update engagement metrics
        await updateEngagementMetrics(complaint);
        await complaint.save();

        // Populate user info for response
        await comment.populate('user_id', 'name email');

        res.status(201).json({
            success: true,
            comment: comment
        });
    } catch (err) {
        console.error('Error adding comment:', err);
        res.status(500).json({ message: err.message || 'Failed to add comment' });
    }
});

// GET /api/complaints/:id/comments - Get comments for a complaint
router.get('/:id/comments', async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        const comments = await Comment.find({ complaint_id: req.params.id })
            .populate('user_id', 'name email')
            .sort({ createdAt: -1 })
            .lean();

        res.json(comments);
    } catch (err) {
        console.error('Error fetching comments:', err);
        res.status(500).json({ message: 'Failed to fetch comments' });
    }
});

// PUT /api/complaints/:id/comments/:commentId/like - Like a comment
router.put('/:id/comments/:commentId/like', authenticate, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        const userId = req.user.id;
        const userIdObjectId = new mongoose.Types.ObjectId(userId);

        if (!comment.likedBy) {
            comment.likedBy = [];
        }

        const hasLiked = comment.likedBy.some(id => id.toString() === userId);

        if (hasLiked) {
            // Unlike
            comment.likedBy = comment.likedBy.filter(id => id.toString() !== userId);
            comment.likes = Math.max(0, comment.likes - 1);
        } else {
            // Like
            comment.likedBy.push(userIdObjectId);
            comment.likes += 1;
        }

        await comment.save();

        res.json({
            comment: comment,
            hasLiked: !hasLiked
        });
    } catch (err) {
        console.error('Error liking comment:', err);
        res.status(500).json({ message: err.message || 'Failed to like comment' });
    }
});

/**
 * Update engagement metrics and auto-escalate based on engagement
 */
async function updateEngagementMetrics(complaint) {
    // Calculate engagement score: votes + (comments * 2) + time factor
    const votesWeight = 1;
    const commentsWeight = 2;

    complaint.engagementScore = (complaint.votes || 0) * votesWeight +
        (complaint.commentCount || 0) * commentsWeight;

    // Update last engagement time
    complaint.lastEngagementAt = new Date();

    // Calculate trend score (time-weighted engagement)
    // More recent engagement = higher trend score
    const hoursSinceCreation = (new Date() - complaint.createdAt) / (1000 * 60 * 60);
    const timeDecay = Math.max(0.1, 1 / (1 + hoursSinceCreation / 24)); // Decay over 24 hours
    complaint.trendScore = complaint.engagementScore * timeDecay;

    // Auto-escalate based on engagement thresholds
    const escalationThresholds = [
        { engagement: 10, priorityBoost: 1 },  // Medium engagement -> boost priority by 1
        { engagement: 25, priorityBoost: 2 },  // High engagement -> boost priority by 2
        { engagement: 50, priorityBoost: 2, trending: true } // Very high -> trending
    ];

    let maxBoost = 0;
    let shouldTrend = false;

    for (const threshold of escalationThresholds) {
        if (complaint.engagementScore >= threshold.engagement) {
            maxBoost = Math.max(maxBoost, threshold.priorityBoost);
            if (threshold.trending) {
                shouldTrend = true;
            }
        }
    }

    complaint.priorityBoost = maxBoost;
    complaint.isTrending = shouldTrend || complaint.trendScore > 30;

    // Auto-update priority if engagement is high (but don't exceed High)
    if (maxBoost > 0 && complaint.priority !== 'High') {
        const priorityLevels = ['Low', 'Medium', 'High'];
        const currentIndex = priorityLevels.indexOf(complaint.priority);
        const newIndex = Math.min(priorityLevels.length - 1, currentIndex + maxBoost);
        if (newIndex > currentIndex) {
            complaint.priority = priorityLevels[newIndex];
        }
    }
}

// Helper: escape special regex characters in user-provided area string
function escapeRegex(str) {
    if (!str || typeof str !== 'string') return '';
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').trim();
}

// Earth radius in km for geo queries
const EARTH_RADIUS_KM = 6378.1;

// GET /api/complaints/nearby - Get nearby open/active complaints (smart DB filtering)
router.get('/nearby', authenticate, async (req, res) => {
    try {
        const { latitude, longitude, radius = 5, sortBy = 'trending', area } = req.query; // radius in km, default 5km
        const userId = req.user.id;
        const radiusKm = Math.min(Math.max(parseFloat(radius) || 5, 1), 5000);

        // Base: open/active complaints only
        const query = {
            status: { $nin: ['Resolved', 'Rejected'] }
        };

        const hasCoords = latitude != null && longitude != null && !Number.isNaN(parseFloat(latitude)) && !Number.isNaN(parseFloat(longitude));
        const lng = hasCoords ? parseFloat(longitude) : null;
        const lat = hasCoords ? parseFloat(latitude) : null;

        // Resolve user area (for area-based fallback when complaint has no coordinates)
        let filterArea = (area && typeof area === 'string' && area.trim()) ? area.trim() : null;
        if (!filterArea) {
            const user = await User.findById(userId).select('area').lean();
            filterArea = user?.area?.trim() || null;
        }

        if (hasCoords && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
            // Show open issues within radius OR issues with NO location data (global/unknown location)
            const geoMatch = {
                coordinates: {
                    $geoWithin: {
                        $centerSphere: [[lng, lat], radiusKm / EARTH_RADIUS_KM]
                    }
                }
            };

            const noCoords = {
                $or: [
                    { coordinates: { $exists: false } },
                    { coordinates: null }
                ]
            };

            if (filterArea) {
                const escaped = escapeRegex(filterArea);
                const areaRegex = new RegExp(escaped, 'i');
                const areaMatch = {
                    $or: [{ area: areaRegex }, { address: areaRegex }]
                };
                // Nearby OR Area Match OR No Location
                query.$or = [geoMatch, areaMatch, noCoords];
            } else {
                // Nearby OR No Location
                query.$or = [geoMatch, noCoords];
            }
        } else {
            // No user coords: filter by user area only
            if (filterArea) {
                const escaped = escapeRegex(filterArea);
                if (escaped) {
                    query.$or = [
                        { area: new RegExp(escaped, 'i') },
                        { address: new RegExp(escaped, 'i') }
                    ];
                }
            }
        }

        // Sorting (uses compound index when possible)
        let sortOption = { trendScore: -1, engagementScore: -1, createdAt: -1 };
        if (sortBy === 'recent') sortOption = { createdAt: -1 };
        else if (sortBy === 'engagement') sortOption = { engagementScore: -1, trendScore: -1, createdAt: -1 };
        else if (sortBy === 'trending') sortOption = { isTrending: -1, trendScore: -1, engagementScore: -1, createdAt: -1 };

        const complaints = await Complaint.find(query)
            .sort(sortOption)
            .limit(20)
            .lean();

        // Check which ones user has voted on
        const complaintsWithVoteStatus = await Promise.all(
            complaints.map(async (complaint) => {
                const hasVoted = complaint.votedBy &&
                    complaint.votedBy.some(id => id.toString() === userId);
                return {
                    ...complaint,
                    isOpen: true,
                    hasVoted: hasVoted || false
                };
            })
        );

        res.json(complaintsWithVoteStatus);
    } catch (err) {
        console.error('Error fetching nearby complaints:', err);
        res.status(500).json({ message: 'Failed to fetch nearby complaints' });
    }
});

// GET /api/complaints/verifiable - Get nearby resolved complaints available for verification (smart DB + single query)
router.get('/verifiable', authenticate, async (req, res) => {
    try {
        const { latitude, longitude, radius = 5, area } = req.query;
        const userId = req.user.id;
        const radiusKm = Math.min(Math.max(parseFloat(radius) || 5, 1), 5000);
        const userObjId = new mongoose.Types.ObjectId(userId);

        const hasCoords = latitude != null && longitude != null && !Number.isNaN(parseFloat(latitude)) && !Number.isNaN(parseFloat(longitude));
        const lng = hasCoords ? parseFloat(longitude) : null;
        const lat = hasCoords ? parseFloat(latitude) : null;

        const match = {
            status: 'Resolved',
            // citizen_id: { $ne: userObjId } // Allow self-verification for testing
        };

        let filterArea = (area && typeof area === 'string' && area.trim()) ? area.trim() : null;
        if (!filterArea) {
            const user = await User.findById(userId).select('area').lean();
            filterArea = user?.area?.trim() || null;
        }

        if (hasCoords && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
            const geoMatch = {
                coordinates: {
                    $geoWithin: {
                        $centerSphere: [[lng, lat], radiusKm / EARTH_RADIUS_KM]
                    }
                }
            };

            const noCoords = {
                $or: [
                    { coordinates: { $exists: false } },
                    { coordinates: null }
                ]
            };

            if (filterArea) {
                const escaped = escapeRegex(filterArea);
                const areaRegex = new RegExp(escaped, 'i');
                const areaMatch = {
                    $or: [{ area: areaRegex }, { address: areaRegex }]
                };
                match.$or = [geoMatch, areaMatch, noCoords];
            } else {
                match.$or = [geoMatch, noCoords];
            }
        } else {
            if (filterArea) {
                const escaped = escapeRegex(filterArea);
                if (escaped) {
                    match.$or = [
                        { area: new RegExp(escaped, 'i') },
                        { address: new RegExp(escaped, 'i') }
                    ];
                }
            }
        }

        const result = await Complaint.aggregate([
            { $match: match },
            { $sort: { createdAt: -1 } },
            { $limit: 25 },
            {
                $lookup: {
                    from: 'verificationsubmissions',
                    let: { cid: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$complaint_id', '$$cid'] },
                                verifier_id: userObjId
                            }
                        },
                        { $limit: 1 }
                    ],
                    as: 'userVerification'
                }
            },
            {
                $addFields: {
                    canVerify: { $eq: [{ $size: '$userVerification' }, 0] }
                }
            },
            { $match: { canVerify: true } },
            { $limit: 20 },
            {
                $project: {
                    userVerification: 0
                }
            }
        ]);

        const formatted = result.map(c => ({
            ...c,
            canVerify: true,
            verificationCount: c.verificationCount || 0,
            isVerified: c.isVerified || false
        }));

        res.json(formatted);
    } catch (err) {
        console.error('Error fetching verifiable complaints:', err);
        res.status(500).json({ message: 'Failed to fetch verifiable complaints' });
    }
});

// POST /api/complaints/:id/verify - Submit verification with image
router.post('/:id/verify', authenticate, verificationUpload.single('verificationImage'), async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Check if complaint is resolved
        if (complaint.status !== 'Resolved') {
            return res.status(400).json({
                message: 'Complaint must be resolved before it can be verified'
            });
        }
        const userId = req.user.id;
        const userIdObjectId = new mongoose.Types.ObjectId(userId);

        // Prevent users from verifying their own complaints
        // ALLOWED FOR TESTING/SELF-VERIFICATION FEATURE
        // if (complaint.citizen_id.toString() === userId) {
        //     return res.status(400).json({
        //         message: 'You cannot verify your own complaint'
        //     });
        // }

        // Check if user has already verified this complaint
        const existingVerification = await VerificationSubmission.findOne({
            complaint_id: complaint._id,
            verifier_id: userId
        });

        if (existingVerification) {
            return res.status(400).json({
                message: 'You have already submitted a verification for this complaint'
            });
        }

        // Image is required
        if (!req.file) {
            return res.status(400).json({
                message: 'Verification image is required'
            });
        }

        // AI VERIFICATION STEP
        try {
            const GeminiService = require('../services/geminiService');
            const geminiService = new GeminiService();
            const path = require('path');

            // Read images as Base64
            // Original Complaint Image
            // complaint.image is relative path like "/uploads/..."
            // We need absolute path. Assuming "uploads" is in root or backend root.
            // Adjust path.join based on where uploads folder is relative to this file (routes/complaints.js)
            // If uploads is in backend/uploads, and routes is backend/routes, then .. moves to backend.
            // If complaint image is missing, we can't do AI verification
            if (complaint.image) {
                const originalImagePath = path.join(__dirname, '..', complaint.image);
                // New Verification Image
                const verificationImagePathAbs = req.file.path;

                if (fs.existsSync(originalImagePath) && fs.existsSync(verificationImagePathAbs)) {
                    const originalImageBase64 = fs.readFileSync(originalImagePath, { encoding: 'base64' });
                    const verificationImageBase64 = fs.readFileSync(verificationImagePathAbs, { encoding: 'base64' });

                    const originalDataUri = `data:image/jpeg;base64,${originalImageBase64}`;
                    const verificationDataUri = `data:image/jpeg;base64,${verificationImageBase64}`;

                    const aiResult = await geminiService.verifyResolution(
                        originalDataUri,
                        verificationDataUri,
                        complaint.description || 'Civic Issue'
                    );

                    console.log('AI Verification Result:', aiResult);

                    // Check AI Outcome
                    if (aiResult.isDuplicate) {
                        if (req.file) fs.unlinkSync(req.file.path);
                        return res.status(400).json({
                            message: 'Verification Rejected: The image appears to be a duplicate of the original complaint image.'
                        });
                    }

                    if (!aiResult.isResolved && aiResult.confidence > 0.7) {
                        if (req.file) fs.unlinkSync(req.file.path);
                        return res.status(400).json({
                            message: 'Verification Rejected: The image does not appear to show that the issue is resolved. Please ensure the repair is clearly visible.'
                        });
                    }
                } else {
                    console.log('Skipping AI verification: Original or Verification image file not found on disk.');
                }
            } else {
                console.log('Skipping AI verification: Complaint has no image record.');
            }
        } catch (aiError) {
            console.error('AI Verification Error (proceeding with manual location check):', aiError);
        }

        const { calculateDistance } = require('../utils/geoUtils');
        const { verificationLocation, verificationAddress } = req.body;

        // Verify Location Logic
        if (complaint.coordinates && complaint.coordinates.coordinates && verificationLocation) {
            const [vLat, vLng] = verificationLocation.split(',').map(n => parseFloat(n.trim()));
            const [cLng, cLat] = complaint.coordinates.coordinates; // GeoJSON is [lng, lat]

            if (!isNaN(vLat) && !isNaN(vLng)) {
                const distKm = calculateDistance(vLat, vLng, cLat, cLng);
                const maxDistKm = 0.2; // 200 meters

                if (distKm > maxDistKm) {
                    // Clean up image if rejected
                    if (req.file) fs.unlinkSync(req.file.path);
                    return res.status(400).json({
                        message: `You are too far from the complaint location (${(distKm * 1000).toFixed(0)}m). You must be within 200m.`
                    });
                }
            }
        } else if (complaint.coordinates && complaint.coordinates.coordinates && !verificationLocation) {
            // If complaint has coords, we REQUIRE verification location
            // Clean up image
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({
                message: 'Location permission is required to verify this complaint.'
            });
        }

        // Create verification submission
        const verificationImagePath = `/uploads/verifications/${req.file.filename}`;
        const verificationSubmission = new VerificationSubmission({
            complaint_id: complaint._id,
            verifier_id: userId,
            verification_image: verificationImagePath,
            verification_location: verificationLocation || null,
            verification_address: verificationAddress || null,
            status: 'approved', // Auto-approve for now, can add admin review later
            isTrusted: true, // Can implement trust scoring later
            trustScore: 80 // Default trust score
        });

        await verificationSubmission.save();

        // Update complaint
        if (!complaint.verificationSubmissions) {
            complaint.verificationSubmissions = [];
        }
        complaint.verificationSubmissions.push(verificationSubmission._id);
        complaint.verificationCount = (complaint.verificationCount || 0) + 1;

        // Add to verifiedBy if not already there
        if (!complaint.verifiedBy) {
            complaint.verifiedBy = [];
        }
        if (!complaint.verifiedBy.some(id => id.toString() === userId)) {
            complaint.verifiedBy.push(userIdObjectId);
        }

        // Update trust score (simple: based on number of verifications)
        const minVerificationsForTrust = 2;
        if (complaint.verificationCount >= minVerificationsForTrust) {
            complaint.isVerified = true;
            complaint.trustScore = Math.min(100, 50 + (complaint.verificationCount * 10));
        }

        await complaint.save();

        // Award 20 points for verifying a resolved complaint
        const pointTransaction = new PointTransaction({
            user_id: userId,
            points: 20,
            type: 'complaint_verified',
            description: `${complaint.title} complaint verified`,
            related_complaint_id: complaint._id
        });
        await pointTransaction.save();

        res.status(201).json({
            success: true,
            message: 'Verification submitted successfully',
            verification: verificationSubmission,
            pointsAwarded: 20
        });
    } catch (err) {
        console.error('Verification error:', err);
        // Clean up uploaded file if verification failed
        if (req.file && req.file.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (cleanupErr) {
                console.error('Failed to cleanup verification image:', cleanupErr);
            }
        }
        res.status(500).json({ message: err.message || 'Failed to submit verification' });
    }
});

// PATCH /api/complaints/:id/status - Update complaint status (official/admin only, e.g. mark Resolved)
router.patch('/:id/status', authenticate, requireRole('official', 'admin'), async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Submitted', 'Assigned', 'In Progress', 'Resolved', 'Rejected'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Valid status required: ' + validStatuses.join(', ') });
        }

        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

        const previousStatus = complaint.status;
        complaint.status = status;
        complaint.timeline = complaint.timeline || [];
        complaint.timeline.push({
            status,
            updatedBy: req.user.id,
            note: `Status changed from ${previousStatus} to ${status} by official`
        });
        await complaint.save();

        res.json({ success: true, complaint });
    } catch (err) {
        res.status(500).json({ message: err.message || 'Failed to update status' });
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
