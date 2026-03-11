const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Complaint = require("../models/Complaint");
const PointTransaction = require("../models/PointTransaction");
const { authenticate } = require("../middleware/auth");
const {
  sendSuccess,
  sendError,
  sendServerError,
} = require("../utils/response");

// Middleware: allow only admin role
const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return sendError(res, "Access denied. Admin only.", 403);
  }
  next();
};

/**
 * @route   GET /api/admin/users?page=1&limit=10
 * @desc    Get paginated citizen users aggregated with their complaint count
 * @access  Admin only
 */
router.get("/users", authenticate, adminOnly, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 5));
    const skip = (page - 1) * limit;

    // Run count and paginated data in parallel for reliability
    const [totalUsers, users] = await Promise.all([
      User.countDocuments({ role: "citizen" }),
      User.aggregate([
        { $match: { role: "citizen" } },
        // Join complaints
        {
          $lookup: {
            from: "complaints",
            localField: "_id",
            foreignField: "citizen_id",
            as: "complaints",
          },
        },
        // Join point transactions and sum all points per user
        {
          $lookup: {
            from: "pointtransactions",
            localField: "_id",
            foreignField: "user_id",
            as: "pointTransactions",
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            email: 1,
            phone: 1,
            lastLogin: 1,
            createdAt: 1,
            isActive: 1,
            complaintsFiled: { $size: "$complaints" },
            civicPoints: { $sum: "$pointTransactions.points" },
          },
        },
        { $sort: { lastLogin: -1, createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
      ]),
    ]);

    const totalPages = Math.ceil(totalUsers / limit);

    // Global index so USR001 stays consistent across pages
    const formatted = users.map((user, index) => ({
      id: `CL${String(skip + index + 1).padStart(3, "0")}`,
      _id: user._id,
      name: user.name,
      contact: user.email,
      phone: user.phone,
      isActive: user.isActive,
      complaintsFiled: user.complaintsFiled,
      civicPoints: user.civicPoints || 0,
      lastActive: user.lastLogin
        ? new Date(user.lastLogin).toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        : "Never",
    }));

    return sendSuccess(res, {
      users: formatted,
      pagination: { total: totalUsers, page, limit, totalPages },
    });
  } catch (error) {
    return sendServerError(res, "Failed to fetch users", error);
  }
});

/**
 * @route   GET /api/admin/stats
 * @desc    Get platform-wide stats for admin dashboard
 * @access  Admin only
 */
router.get("/stats", authenticate, adminOnly, async (req, res) => {
  try {
    const [userCount, complaintStats] = await Promise.all([
      User.countDocuments({ role: "citizen" }),
      Complaint.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const statusMap = {};
    complaintStats.forEach(({ _id, count }) => {
      statusMap[_id] = count;
    });

    const totalComplaints = Object.values(statusMap).reduce((a, b) => a + b, 0);
    const resolvedComplaints = statusMap["Resolved"] || 0;
    const activeComplaints =
      (statusMap["Submitted"] || 0) +
      (statusMap["Assigned"] || 0) +
      (statusMap["In Progress"] || 0);
    const rejectedComplaints = statusMap["Rejected"] || 0;

    return sendSuccess(res, {
      totalUsers: userCount,
      totalComplaints,
      activeComplaints,
      resolvedComplaints,
      pendingComplaints: statusMap["Submitted"] || 0,
      rejectedComplaints,
    });
  } catch (error) {
    return sendServerError(res, "Failed to fetch stats", error);
  }
});

/**
 * @route   GET /api/admin/complaints?page=1&limit=10&status=&category=&search=
 * @desc    Get all complaints for admin with filters and pagination
 * @access  Admin only
 */
router.get("/complaints", authenticate, adminOnly, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;
    const { status, category, search } = req.query;

    const query = {};
    if (status && status !== "All") query.status = status;
    if (category && category !== "All")
      query.category = { $regex: category, $options: "i" };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
        { assignedTo: { $regex: search, $options: "i" } },
      ];
    }

    const [total, complaints] = await Promise.all([
      Complaint.countDocuments(query),
      Complaint.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("citizen_id", "name email")
        .lean(),
    ]);

    const formatted = complaints.map((c, index) => ({
      _id: c._id,
      id: `CLR-${String(c._id).slice(-4).toUpperCase()}`,
      title: c.title,
      category: c.category,
      location: c.address,
      status: c.status,
      priority: c.priority,
      assignedTo: c.assignedTo || null,
      assignedOfficerId: c.assignedOfficerId || null,
      citizen: c.citizen_id
        ? { name: c.citizen_id.name, email: c.citizen_id.email }
        : null,
      citizenId: c.citizen_id?._id || c.citizen_id,
      createdAt: c.createdAt,
      timestamp: new Date(c.createdAt).toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    }));

    return sendSuccess(res, {
      complaints: formatted,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return sendServerError(res, "Failed to fetch complaints", error);
  }
});

/**
 * @route   PUT /api/admin/complaints/:id/status
 * @desc    Update complaint status — emits socket event so citizen sees it live
 * @access  Admin only
 */
router.put(
  "/complaints/:id/status",
  authenticate,
  adminOnly,
  async (req, res) => {
    try {
      const { status } = req.body;
      const validStatuses = [
        "Submitted",
        "Assigned",
        "In Progress",
        "Resolved",
        "Rejected",
      ];

      if (!status || !validStatuses.includes(status)) {
        return sendError(
          res,
          `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
          400,
        );
      }

      const complaint = await Complaint.findById(req.params.id);
      if (!complaint) return sendError(res, "Complaint not found", 404);

      const previousStatus = complaint.status;
      complaint.status = status;

      // Append to timeline
      complaint.timeline.push({
        status,
        timestamp: new Date(),
        updatedBy: req.user.id,
        note: `Status changed from ${previousStatus} to ${status} by admin`,
      });

      await complaint.save();

      // Emit real-time event to ALL connected clients
      const io = req.app.get("io");
      io.emit("complaint:statusUpdated", {
        complaintId: complaint._id.toString(),
        citizenId: complaint.citizen_id.toString(),
        newStatus: status,
        previousStatus,
      });

      return sendSuccess(res, {
        complaintId: complaint._id,
        newStatus: status,
        previousStatus,
      });
    } catch (error) {
      return sendServerError(res, "Failed to update complaint status", error);
    }
  },
);

/**
 * @route   GET /api/admin/officers?page=1&limit=10&search=
 * @desc    Get paginated officials with active complaint workload
 * @access  Admin only
 */
router.get("/officers", authenticate, adminOnly, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;
    const { search } = req.query;

    const matchStage = { role: "official" };
    if (search) {
      matchStage.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { ward: { $regex: search, $options: "i" } },
      ];
    }

    const lookupStage = {
      $lookup: {
        from: "complaints",
        let: { officerId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$assignedOfficerId", "$$officerId"] },
                  { $in: ["$status", ["Assigned", "In Progress"]] },
                ],
              },
            },
          },
        ],
        as: "activeComplaints",
      },
    };

    const [total, officers] = await Promise.all([
      User.countDocuments(matchStage),
      User.aggregate([
        { $match: matchStage },
        lookupStage,
        {
          $project: {
            name: 1,
            email: 1,
            phone: 1,
            ward: 1,
            isActive: 1,
            workload: { $size: "$activeComplaints" },
          },
        },
        { $sort: { isActive: -1, workload: 1, name: 1 } },
        { $skip: skip },
        { $limit: limit },
      ]),
    ]);

    const formatted = officers.map((o) => ({
      id: `CLO-${String(o._id).slice(-4).toUpperCase()}`,
      _id: o._id,
      name: o.name,
      email: o.email,
      phone: o.phone,
      department: o.ward || "General",
      workload: o.workload,
      isActive: o.isActive,
      status: o.isActive ? "Active" : "Inactive",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(o.name)}`,
    }));

    return sendSuccess(res, {
      officers: formatted,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return sendServerError(res, "Failed to fetch officers", error);
  }
});

/**
 * @route   POST /api/admin/officers
 * @desc    Create a new official user (default password: Officer@123)
 * @access  Admin only
 */
router.post("/officers", authenticate, adminOnly, async (req, res) => {
  try {
    const { name, email, phone, ward } = req.body;

    if (!name || !email || !phone || !ward)
      return sendError(res, "name, email, phone and ward are required", 400);

    if (!/^\d{10}$/.test(phone))
      return sendError(res, "Phone must be a 10-digit number", 400);

    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing)
      return sendError(
        res,
        existing.email === email
          ? "Email already registered"
          : "Phone already registered",
        409,
      );

    const hashedPassword = await bcrypt.hash("Officer@123", 12);
    const officer = await User.create({
      name,
      email,
      phone,
      ward,
      password: hashedPassword,
      role: "official",
      isActive: true,
    });

    return sendSuccess(res, {
      id: `CLO-${String(officer._id).slice(-4).toUpperCase()}`,
      _id: officer._id,
      name: officer.name,
      email: officer.email,
      phone: officer.phone,
      department: officer.ward,
      defaultPassword: "Officer@123",
      message: `Officer created. Default password is Officer@123`,
    });
  } catch (error) {
    return sendServerError(res, "Failed to create officer", error);
  }
});

/**
 * @route   PUT /api/admin/officers/:id
 * @desc    Update officer's department/ward
 * @access  Admin only
 */
router.put("/officers/:id", authenticate, adminOnly, async (req, res) => {
  try {
    const { ward } = req.body;
    if (!ward) return sendError(res, "ward (department) is required", 400);

    const officer = await User.findOneAndUpdate(
      { _id: req.params.id, role: "official" },
      { $set: { ward } },
      { new: true },
    );
    if (!officer) return sendError(res, "Officer not found", 404);

    return sendSuccess(res, { department: officer.ward });
  } catch (error) {
    return sendServerError(res, "Failed to update officer", error);
  }
});

/**
 * @route   PATCH /api/admin/officers/:id/status
 * @desc    Toggle officer active/inactive
 * @access  Admin only
 */
router.patch(
  "/officers/:id/status",
  authenticate,
  adminOnly,
  async (req, res) => {
    try {
      const officer = await User.findOne({
        _id: req.params.id,
        role: "official",
      });
      if (!officer) return sendError(res, "Officer not found", 404);

      officer.isActive = !officer.isActive;
      await officer.save();

      return sendSuccess(res, {
        isActive: officer.isActive,
        status: officer.isActive ? "Active" : "Inactive",
      });
    } catch (error) {
      return sendServerError(res, "Failed to toggle officer status", error);
    }
  },
);

/**
 * @route   PUT /api/admin/complaints/:id/assign
 * @desc    Assign an official to a complaint — changes status to Assigned
 * @access  Admin only
 */
router.put(
  "/complaints/:id/assign",
  authenticate,
  adminOnly,
  async (req, res) => {
    try {
      const { officerId } = req.body;
      if (!officerId) return sendError(res, "officerId is required", 400);

      const [complaint, officer] = await Promise.all([
        Complaint.findById(req.params.id),
        User.findOne({ _id: officerId, role: "official" }),
      ]);

      if (!complaint) return sendError(res, "Complaint not found", 404);
      if (!officer)
        return sendError(res, "Officer not found or not an official", 404);

      const previousStatus = complaint.status;
      complaint.assignedTo = officer.name;
      complaint.assignedOfficerId = officer._id;
      complaint.status = "Assigned";

      // Set SLA Deadline dynamically based on assignment time instead of creation time
      // We look for 'estimatedResolutionTime' (e.g. "3 days") or default to 3 days.
      let estimatedDays = 3;
      if (complaint.ai && complaint.ai.estimatedResolutionTime) {
        const timeStr = String(
          complaint.ai.estimatedResolutionTime,
        ).toLowerCase();
        const match = timeStr.match(/(\d+)\s+day/);
        if (match && match[1]) {
          estimatedDays = parseInt(match[1], 10);
        } else if (timeStr.includes("week")) {
          estimatedDays = 7;
        }
      }

      // Start the clock exclusively from right now (the assignment moment)
      const deadlineDate = new Date();
      deadlineDate.setDate(deadlineDate.getDate() + estimatedDays);
      complaint.expectedResolutionDate = deadlineDate;

      complaint.timeline.push({
        status: "Assigned",
        timestamp: new Date(),
        updatedBy: req.user.id,
        note: `Assigned to officer: ${officer.name}. Expected resolution by: ${deadlineDate.toDateString()}`,
      });

      await complaint.save();

      const io = req.app.get("io");
      io.emit("complaint:statusUpdated", {
        complaintId: complaint._id.toString(),
        citizenId: complaint.citizen_id.toString(),
        newStatus: "Assigned",
        previousStatus,
      });

      return sendSuccess(res, {
        complaintId: complaint._id,
        assignedTo: officer.name,
        assignedOfficerId: officer._id,
        expectedResolutionDate: complaint.expectedResolutionDate,
        status: "Assigned",
      });
    } catch (error) {
      return sendServerError(res, "Failed to assign officer", error);
    }
  },
);

/**
 * @route   GET /api/admin/analytics
 * @desc    Get complaint analytics: categories, status overview, top locations
 * @access  Admin only
 */
router.get("/analytics", authenticate, adminOnly, async (req, res) => {
  try {
    const [categoryData, statusData, locationData] = await Promise.all([
      // 1. Group complaints by category, sort by count descending
      Complaint.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // 2. Group complaints by status, sort by count descending
      Complaint.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // 3. Extract first segment of address as area, group and return top 5
      Complaint.aggregate([
        {
          $project: {
            area: {
              $trim: {
                input: { $arrayElemAt: [{ $split: ["$address", ","] }, 0] },
              },
            },
          },
        },
        { $match: { area: { $ne: "" } } },
        { $group: { _id: "$area", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
    ]);

    return sendSuccess(res, {
      categories: categoryData.map((d) => ({
        name: d._id || "Uncategorized",
        count: d.count,
      })),
      statusOverview: statusData.map((d) => ({ name: d._id, count: d.count })),
      locations: locationData.map((d) => ({ name: d._id, count: d.count })),
    });
  } catch (error) {
    return sendServerError(res, "Failed to fetch analytics", error);
  }
});

module.exports = router;
