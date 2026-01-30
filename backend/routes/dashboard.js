const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { authenticate } = require('../middleware/auth');
const { sendSuccess, sendServerError } = require('../utils/response');
const Complaint = require('../models/Complaint');
const PointTransaction = require('../models/PointTransaction');
const User = require('../models/User');

/**
 * @route   GET /api/dashboard
 * @desc    Get user dashboard data
 * @access  Private
 */
router.get('/', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;

        // Get user info (name, area for location fallback)
        const user = await User.findById(userId).select('name area');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Get user's most recent complaint for location extraction
        const mostRecentComplaint = await Complaint.findOne({ citizen_id: userId })
            .sort({ createdAt: -1 })
            .select('address')
            .lean();

        // Extract location from address (simple parsing - get first part before comma or use full address)
        let location = 'Location not available';
        if (mostRecentComplaint && mostRecentComplaint.address) {
            const address = mostRecentComplaint.address.trim();
            
            // Filter out placeholder/invalid addresses
            const invalidAddresses = [
                'detecting location',
                'detecting location...',
                'location not available',
                'add location',
                'enter location',
                ''
            ];
            
            const addressLower = address.toLowerCase();
            if (invalidAddresses.some(invalid => addressLower.includes(invalid))) {
                // Try to find a valid complaint with a real address
                const validComplaint = await Complaint.findOne({
                    citizen_id: userId,
                    address: { $exists: true, $ne: '' },
                    $expr: {
                        $not: {
                            $regexMatch: {
                                input: { $toLower: '$address' },
                                regex: 'detecting|location not available|add location|enter location'
                            }
                        }
                    }
                })
                .sort({ createdAt: -1 })
                .select('address')
                .lean();
                
                if (validComplaint && validComplaint.address) {
                    const addressParts = validComplaint.address.split(',');
                    if (addressParts.length > 0) {
                        location = addressParts[0].trim();
                    } else {
                        location = validComplaint.address;
                    }
                }
            } else {
                // Valid address - extract location
                const addressParts = address.split(',');
                if (addressParts.length > 0) {
                    location = addressParts[0].trim();
                } else {
                    location = address;
                }
            }
        }

        // Calculate statistics
        // Active Issues: status NOT 'Resolved' or 'Rejected'
        const activeIssues = await Complaint.countDocuments({
            citizen_id: userId,
            status: { $nin: ['Resolved', 'Rejected'] }
        });

        // Resolved Issues: status is 'Resolved'
        const resolvedIssues = await Complaint.countDocuments({
            citizen_id: userId,
            status: 'Resolved'
        });

        // Calculate total civic points
        const pointsResult = await PointTransaction.aggregate([
            { $match: { user_id: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: null, total: { $sum: '$points' } } }
        ]);
        const civicPoints = pointsResult.length > 0 ? pointsResult[0].total : 0;

        // Generate impact graph data (last 4 weeks)
        const fourWeeksAgo = new Date();
        fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

        // Get complaints created in last 4 weeks, grouped by week
        const complaintsCreated = await Complaint.aggregate([
            {
                $match: {
                    citizen_id: new mongoose.Types.ObjectId(userId),
                    createdAt: { $gte: fourWeeksAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        week: { $week: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get complaints verified in last 4 weeks
        // We need to check PointTransaction for verification activities
        const verifications = await PointTransaction.aggregate([
            {
                $match: {
                    user_id: new mongoose.Types.ObjectId(userId),
                    type: 'complaint_verified',
                    createdAt: { $gte: fourWeeksAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        week: { $week: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Create a map for easier lookup
        const createdMap = {};
        complaintsCreated.forEach(item => {
            const key = `${item._id.year}-${item._id.week}`;
            createdMap[key] = item.count;
        });

        const verifiedMap = {};
        verifications.forEach(item => {
            const key = `${item._id.year}-${item._id.week}`;
            verifiedMap[key] = item.count;
        });

        // Generate 4 weeks of data
        const weeks = [];
        const now = new Date();
        for (let i = 3; i >= 0; i--) {
            const weekDate = new Date(now);
            weekDate.setDate(weekDate.getDate() - (i * 7));
            const year = weekDate.getFullYear();
            const week = getWeekNumber(weekDate);
            const key = `${year}-${week}`;

            weeks.push({
                week: `Week ${4 - i}`,
                complaintsCreated: createdMap[key] || 0,
                complaintsVerified: verifiedMap[key] || 0
            });
        }

        // Get recent activities (last 10 transactions)
        const recentActivities = await PointTransaction.find({ user_id: userId })
            .sort({ createdAt: -1 })
            .limit(10)
            .select('points description createdAt')
            .lean();

        const formattedActivities = recentActivities.map(activity => ({
            points: activity.points,
            description: activity.description,
            createdAt: activity.createdAt
        }));

        // Return dashboard data (use user.area as location fallback when no complaint-based location)
        const displayLocation = location !== 'Location not available' ? location : (user.area || location);
        return sendSuccess(res, {
            user: {
                name: user.name,
                location: displayLocation,
                area: user.area
            },
            statistics: {
                activeIssues: activeIssues,
                resolvedIssues: resolvedIssues,
                civicPoints: civicPoints
            },
            impactGraph: {
                weeks: weeks
            },
            recentActivities: formattedActivities
        });

    } catch (error) {
        console.error('Dashboard error:', error);
        return sendServerError(res, 'Failed to fetch dashboard data', error);
    }
});

/**
 * Helper function to get ISO week number
 */
function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

module.exports = router;
