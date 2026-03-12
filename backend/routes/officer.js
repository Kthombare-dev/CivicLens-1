const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Complaint = require("../models/Complaint");
const User = require("../models/User");
const { authenticate } = require("../middleware/auth");
const {
  sendSuccess,
  sendError,
  sendServerError,
} = require("../utils/response");

// Middleware: allow only official role
const officialOnly = (req, res, next) => {
  if (req.user?.role !== "official") {
    return sendError(res, "Access denied. Official only.", 403);
  }
  next();
};

/**
 * Helper to calculate active Days Left based on expectedResolutionDate
 */
const calculateDaysLeft = (expectedDate) => {
  if (!expectedDate) return null;
  const now = new Date();
  const diffTime = new Date(expectedDate) - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * @route   GET /api/officer/dashboard-stats
 * @desc    Get counts for officer dashboard top cards including SLA metrics
 * @access  Official only
 */
router.get("/dashboard-stats", authenticate, officialOnly, async (req, res) => {
  try {
    const officerId = req.user.id;

    const complaints = await Complaint.find({ assignedOfficerId: new mongoose.Types.ObjectId(officerId) })
      .select("status expectedResolutionDate")
      .lean();

    let totalAssigned = 0;
    let inProgress = 0;
    let resolved = 0;
    let pendingReview = 0;
    let overdue = 0;
    let escalated = 0; // Simplified for now based on priority or custom logic

    const now = new Date();

    complaints.forEach((c) => {
      totalAssigned++;

      if (c.status === "In Progress") inProgress++;
      if (c.status === "Resolved") resolved++;
      if (c.status === "Submitted" || c.status === "Assigned") pendingReview++;

      // Overdue check: only if it's not resolved/rejected and the deadline has passed
      if (
        !["Resolved", "Rejected"].includes(c.status) &&
        c.expectedResolutionDate &&
        new Date(c.expectedResolutionDate) < now
      ) {
        overdue++;
      }
    });

    return sendSuccess(res, {
      totalAssigned,
      inProgress,
      resolved,
      pendingReview,
      overdue,
      escalated,
    });
  } catch (error) {
    return sendServerError(res, "Failed to fetch tracking stats", error);
  }
});

/**
 * @route   GET /api/officer/complaints
 * @desc    Get tabular list of complaints assigned to officer with live SLA countdown
 * @access  Official only
 */
router.get("/complaints", authenticate, officialOnly, async (req, res) => {
  try {
    const officerId = req.user.id;
    const { status } = req.query;

    const query = { assignedOfficerId: new mongoose.Types.ObjectId(officerId) };
    if (status && status !== "All") {
      query.status = status;
    }
    console.log("Fetching complaints for officer ID:", officerId);
    console.log("Query:", query);

    const complaints = await Complaint.find(query)
      .sort({ createdAt: -1 })
      .populate("citizen_id", "name phone")
      .select(
        "title description images category address status priority createdAt expectedResolutionDate citizen_id",
      )
      .lean();

    const formatted = complaints.map((c) => {
      const daysLeft = calculateDaysLeft(c.expectedResolutionDate);
      return {
        _id: c._id,
        id: `CLR-${String(c._id).slice(-4).toUpperCase()}`,
        title: c.title,
        description: c.description,
        images: c.images || [],
        category: c.category,
        location: c.address,
        status: c.status,
        priority: c.priority,
        reporter: c.citizen_id ? c.citizen_id.name : "Unknown Citizen",
        phone: c.citizen_id ? c.citizen_id.phone : "No phone provided",
        expectedResolutionDate: c.expectedResolutionDate,
        date: new Date(c.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
        daysLeft: daysLeft,
        isOverdue:
          daysLeft !== null &&
          daysLeft < 0 &&
          !["Resolved", "Rejected"].includes(c.status),
      };
    });

    return sendSuccess(res, {
      complaints: formatted,
    });
  } catch (error) {
    return sendServerError(res, "Failed to fetch assigned complaints", error);
  }
});

/**
 * @route   GET /api/officer/complaints/:id
 * @desc    Get deep details of a single assigned complaint for Slide-Over Drawer
 * @access  Official only
 */
router.get("/complaints/:id", authenticate, officialOnly, async (req, res) => {
  try {
    const officerId = req.user.id;
    const complaintId = req.params.id;

    const complaint = await Complaint.findOne({
      _id: new mongoose.Types.ObjectId(complaintId),
      assignedOfficerId: new mongoose.Types.ObjectId(officerId),
    })
      .populate("citizen_id", "name phone")
      .lean();

    if (!complaint)
      return sendError(res, "Complaint not found or not assigned to you", 404);

    const daysLeft = calculateDaysLeft(complaint.expectedResolutionDate);

    // Format for frontend
    const detailView = {
      id: `CLR-${String(complaint._id).slice(-4).toUpperCase()}`,
      _id: complaint._id,
      category: complaint.category,
      location: complaint.address,
      description: complaint.description,
      status: complaint.status,
      priority: complaint.priority,
      date: new Date(complaint.createdAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      reporter: complaint.citizen_id
        ? complaint.citizen_id.name
        : "Unknown Citizen",
      phone: complaint.citizen_id
        ? complaint.citizen_id.phone
        : "No phone provided",
      images: complaint.images || [],
      daysLeft,
      expectedResolutionDate: complaint.expectedResolutionDate,
      isOverdue:
        daysLeft !== null &&
        daysLeft < 0 &&
        !["Resolved", "Rejected"].includes(complaint.status),
      timeline: complaint.timeline,
    };

    return sendSuccess(res, { complaint: detailView });
  } catch (error) {
    return sendServerError(res, "Failed to fetch complaint details", error);
  }
});

/**
 * @route   PUT /api/officer/complaints/:id/status
 * @desc    Update complaint status and record SLA metric permanently
 * @access  Official only
 */
router.put(
  "/complaints/:id/status",
  authenticate,
  officialOnly,
  async (req, res) => {
    try {
      const { status } = req.body;
      const officerId = req.user.id;
      const validStatuses = ["In Progress", "Resolved"]; // Official cannot send back to Submitted etc.

      if (!status || !validStatuses.includes(status)) {
        return sendError(
          res,
          `Invalid status update for officer. Allowed: ${validStatuses.join(", ")}`,
          400,
        );
      }

      const complaint = await Complaint.findOne({
        _id: new mongoose.Types.ObjectId(req.params.id),
        assignedOfficerId: new mongoose.Types.ObjectId(officerId),
      });
      if (!complaint)
        return sendError(
          res,
          "Complaint not found or not assigned to you",
          404,
        );

      const previousStatus = complaint.status;
      complaint.status = status;

      let note = `Status changed to ${status} by assigned officer.`;

      // If resolving, check SLA
      if (status === "Resolved" && complaint.expectedResolutionDate) {
        const now = new Date();
        const isOnTime = now <= new Date(complaint.expectedResolutionDate);
        note += isOnTime ? " [SLA MET]" : " [SLA MISSED: Overdue]";

        // Optionally, we could store a permanent field 'resolvedOnTime: Boolean'
        // but the timeline acts as the immutable log.
      }

      // Append to timeline
      complaint.timeline.push({
        status,
        timestamp: new Date(),
        updatedBy: officerId,
        note: note,
      });

      await complaint.save();

      // Emit real-time event to ALL connected clients
      const io = req.app.get("io");
      if (io) {
        io.emit("complaint:statusUpdated", {
          complaintId: complaint._id.toString(),
          citizenId: complaint.citizen_id.toString(),
          newStatus: status,
          previousStatus,
        });
      }

      return sendSuccess(res, {
        complaintId: complaint._id,
        newStatus: status,
        previousStatus,
        message: "Status updated successfully",
      });
    } catch (error) {
      return sendServerError(res, "Failed to update status", error);
    }
  },
);

module.exports = router;
