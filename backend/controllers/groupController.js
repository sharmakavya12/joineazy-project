const mongoose = require("mongoose");
const Group = require("../models/Group");
const Assignment = require("../models/Assignment");
const Course = require("../models/Course");
const Submission = require("../models/Submission");

// CREATE GROUP
exports.createGroup = async (req, res) => {
  try {
    const { name, assignmentId, courseId, memberIds } = req.body;

    if (!name || !assignmentId || !courseId) {
      return res.status(400).json({
        message: "name, assignmentId and courseId are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(400).json({ message: "Invalid assignment ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (assignment.submissionType !== "group") {
      return res.status(400).json({
        message: "This assignment does not allow group submission",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Ensure creator is enrolled in the course
    const isEnrolled = course.students.some(
      (s) => s.toString() === req.user.id
    );
    if (!isEnrolled) {
      return res.status(403).json({ message: "You are not enrolled in this course" });
    }

    let members = [req.user.id];

    if (memberIds && Array.isArray(memberIds)) {
      for (let id of memberIds) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: `Invalid member ID: ${id}` });
        }
      }
      members = [...new Set([req.user.id, ...memberIds])];
    }

    // Check if any member is already in a group for this assignment
    const existingGroup = await Group.findOne({
      assignment: assignmentId,
      members: { $in: members },
    });

    if (existingGroup) {
      return res.status(400).json({
        message: "One or more members are already in a group for this assignment",
      });
    }

    const group = await Group.create({
      name: name.trim(),
      assignment: assignmentId,
      course: courseId,
      leader: req.user.id,
      members,
    });

    const populatedGroup = await Group.findById(group._id)
      .populate("leader", "name email role")
      .populate("members", "name email role")
      .populate("assignment", "title deadline submissionType")
      .populate("course", "title code");

 return res.status(201).json({
  success: true,
  message: "Group created successfully",
  data: {
    group: populatedGroup,
  },
});
  } catch (err) {
    return res.status(500).json({ message: "Error creating group", error: err.message });
  }
};

// GET MY GROUPS (student)
exports.getMyGroup = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user.id })
      .populate("leader", "name email role")
      .populate("members", "name email role")
      .populate("assignment", "title deadline submissionType")
      .populate("course", "title code")
      .sort({ createdAt: -1 });

    // Attach submission status to each group
    const enriched = await Promise.all(
      groups.map(async (g) => {
        const submission = await Submission.findOne({
          assignmentId: g.assignment?._id,
          groupId: g._id,
          confirmed: true,
        });
        return {
          ...g.toObject(),
          isLeader: g.leader._id.toString() === req.user.id,
          submitted: !!submission,
          submittedAt: submission?.confirmedAt || null,
        };
      })
    );

    return res.status(200).json({
  success: true,
  message: "My groups fetched successfully",
  data: {
    groups: enriched,
  },
});
  } catch (err) {
    return res.status(500).json({ message: "Error fetching groups", error: err.message });
  }
};

// GET GROUPS BY ASSIGNMENT (professor)
exports.getGroupsByAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(400).json({ message: "Invalid assignment ID" });
    }

    const groups = await Group.find({ assignment: assignmentId })
      .populate("leader", "name email")
      .populate("members", "name email")
      .sort({ createdAt: -1 });

    // Attach submission status
    const enriched = await Promise.all(
      groups.map(async (g) => {
        const submission = await Submission.findOne({
          assignmentId,
          groupId: g._id,
          confirmed: true,
        });
        return {
          ...g.toObject(),
          submitted: !!submission,
          submittedAt: submission?.confirmedAt || null,
        };
      })
    );

    return res.status(200).json({
      message: "Groups fetched successfully",
      groups: enriched,
    });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching groups", error: err.message });
  }
};