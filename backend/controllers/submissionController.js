const mongoose = require("mongoose");
const Submission = require("../models/Submission");
const Group = require("../models/Group");
const Assignment = require("../models/Assignment");

// CONFIRM / ACKNOWLEDGE SUBMISSION
exports.confirmSubmission = async (req, res) => {
  try {
    const { groupId, studentId } = req.body;
    const { assignmentId } = req.params;

    if (!assignmentId || !mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(400).json({ message: "Valid assignment ID is required" });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // ─── GROUP SUBMISSION ──────────────────────────────────────────────────────
    if (assignment.submissionType === "group") {
      if (!groupId || !mongoose.Types.ObjectId.isValid(groupId)) {
        return res.status(400).json({ message: "Valid groupId is required for group assignment" });
      }

      const group = await Group.findById(groupId).populate("members", "_id");
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }

      // Only group leader can acknowledge
      if (group.leader.toString() !== req.user.id) {
        return res.status(403).json({
          message: "Only the group leader can acknowledge submission",
        });
      }

      // Check if group submission already exists
      const existingGroupSub = await Submission.findOne({ assignmentId, groupId });
      if (existingGroupSub) {
        return res.status(400).json({ message: "Group submission already confirmed" });
      }

      const now = new Date();
      const memberIds = group.members.map((m) => m._id);

      // Create one submission record per member (so each member's status is visible)

      const submissionDocs = memberIds.map((memberId) => ({
        assignmentId,
        groupId,
        studentId: memberId,
        submitted: true,
        confirmed: true,
        acknowledgedByLeader: true,
        confirmedAt: now,
        confirmedBy: req.user.id,
        oneDriveLink: req.body.oneDriveLink || "",
        submissionTitle: req.body.submissionTitle,
        notes: req.body.notes || "",
      }));


      // Use insertMany — but skip duplicates gracefully
      const inserted = await Submission.insertMany(submissionDocs, {
        ordered: false,
      }).catch((err) => {
        // Some may already exist — return what was inserted
        if (err.code === 11000) return err.insertedDocs || [];
        throw err;
      });

      return res.status(201).json({
        message: `Group submission confirmed for ${memberIds.length} member(s)`,
        groupId,
        membersCount: memberIds.length,
      });
    }

    // ─── INDIVIDUAL SUBMISSION ────────────────────────────────────────────────
    const targetStudentId = studentId || req.user.id;

    if (!mongoose.Types.ObjectId.isValid(targetStudentId)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    // Students can only confirm their own submission
    if (req.user.role === "student" && req.user.id !== targetStudentId) {
      return res.status(403).json({
        message: "Students can only confirm their own submission",
      });
    }

    const existing = await Submission.findOne({
      assignmentId,
      studentId: targetStudentId,
      groupId: null,
    });

    if (existing) {
      return res.status(400).json({ message: "Submission already confirmed" });
    }


    const submission = await Submission.create({
      assignmentId,
      groupId: null,
      studentId: targetStudentId,
      submitted: true,
      confirmed: true,
      acknowledgedByLeader: false,
      confirmedAt: new Date(),
      confirmedBy: req.user.id,
      oneDriveLink: req.body.oneDriveLink || "",
      submissionTitle: req.body.submissionTitle,
      notes: req.body.notes || "",
    });


    return res.status(201).json({
      message: "Individual submission confirmed successfully",
      submission,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error confirming submission",
      error: err.message,
    });
  }
};

// GET SUBMISSIONS (Professor: all; Student: only their own)
exports.getSubmissions = async (req, res) => {
  try {
    const filters = {};

    if (req.query.assignmentId) filters.assignmentId = req.query.assignmentId;
    if (req.query.groupId) filters.groupId = req.query.groupId;
    if (req.query.confirmed !== undefined) {
      filters.confirmed = req.query.confirmed === "true";
    }

    // Students can only see their own submissions
    if (req.user.role === "student") {
      filters.studentId = req.user.id;
    } else if (req.query.studentId) {
      filters.studentId = req.query.studentId;
    }

    const submissions = await Submission.find(filters)
      .populate("assignmentId", "title submissionType deadline")
      .populate("groupId", "name leader")
      .populate("studentId", "name email")
      .populate("confirmedBy", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Submissions fetched successfully",
      submissions,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error fetching submissions",
      error: err.message,
    });
  }
};

// GET SUBMISSION STATUS for a specific assignment (student checks own status)
exports.getMySubmissionStatus = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(400).json({ message: "Invalid assignment ID" });
    }

    const submission = await Submission.findOne({
      assignmentId,
      studentId: req.user.id,
    })
      .populate("groupId", "name leader members")
      .populate("confirmedBy", "name email");

    if (!submission) {
      return res.status(200).json({
        submitted: false,
        confirmed: false,
        message: "No submission found",
      });
    }

    return res.status(200).json({
      submitted: submission.submitted,
      confirmed: submission.confirmed,
      acknowledgedByLeader: submission.acknowledgedByLeader,
      confirmedAt: submission.confirmedAt,
      confirmedBy: submission.confirmedBy,
      group: submission.groupId,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error fetching submission status",
      error: err.message,
    });
  }
};