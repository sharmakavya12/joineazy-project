const mongoose = require("mongoose");
const Assignment = require("../models/Assignment");
const Course = require("../models/Course");
const Submission = require("../models/Submission");

// CREATE ASSIGNMENT
exports.createAssignment = async (req, res) => {
  try {
    const {
      title,
      description,
      deadline,
      oneDriveLink,
      submissionType,
      course,
    } = req.body;

    if (!title || !description || !deadline || !submissionType || !course) {
      return res.status(400).json({
        message: "Title, description, deadline, submissionType, and course are required",
      });
    }

    if (!["individual", "group"].includes(submissionType.toLowerCase())) {
      return res.status(400).json({
        message: "submissionType must be either 'individual' or 'group'",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(course)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const existingCourse = await Course.findById(course);
    if (!existingCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    const assignment = await Assignment.create({
      title: title.trim(),
      description: description.trim(),
      deadline,
      oneDriveLink: oneDriveLink || "",
      submissionType: submissionType.toLowerCase(),
      course,
      createdBy: req.user.id,
    });

    await Course.findByIdAndUpdate(course, {
      $addToSet: { assignments: assignment._id },
    });

    return res.status(201).json({
      message: "Assignment created successfully",
      assignment,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error creating assignment",
      error: err.message,
    });
  }
};

// GET ALL ASSIGNMENTS
exports.getAssignments = async (req, res) => {
  try {
    const filters = {};

    if (req.query.course) {
      filters.course = req.query.course;
    }

    if (req.query.createdBy) {
      filters.createdBy = req.query.createdBy;
    }

    const assignments = await Assignment.find(filters)
      .populate("createdBy", "name email role")
      .populate("course", "title code")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Assignments fetched successfully",
      assignments,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error fetching assignments",
      error: err.message,
    });
  }
};

// GET ASSIGNMENT BY ID
exports.getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findById(id)
      .populate("createdBy", "name email role")
      .populate("course", "title code");

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    return res.status(200).json({
      message: "Assignment fetched successfully",
      assignment,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error fetching assignment",
      error: err.message,
    });
  }
};

// UPDATE ASSIGNMENT
exports.updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      deadline,
      oneDriveLink,
      submissionType,
      course,
    } = req.body;

    const assignment = await Assignment.findById(id);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (title !== undefined) assignment.title = title.trim();
    if (description !== undefined) assignment.description = description.trim();
    if (deadline !== undefined) assignment.deadline = deadline;
    if (oneDriveLink !== undefined) assignment.oneDriveLink = oneDriveLink;

    if (submissionType !== undefined) {
      const normalizedType = submissionType.toLowerCase();
      if (!["individual", "group"].includes(normalizedType)) {
        return res.status(400).json({
          message: "submissionType must be either 'individual' or 'group'",
        });
      }
      assignment.submissionType = normalizedType;
    }

    if (course !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(course)) {
        return res.status(400).json({ message: "Invalid course ID" });
      }

      const newCourse = await Course.findById(course);
      if (!newCourse) {
        return res.status(404).json({ message: "New course not found" });
      }

      if (assignment.course.toString() !== course) {
        await Course.findByIdAndUpdate(assignment.course, {
          $pull: { assignments: assignment._id },
        });

        await Course.findByIdAndUpdate(course, {
          $addToSet: { assignments: assignment._id },
        });

        assignment.course = course;
      }
    }

    await assignment.save();

    return res.status(200).json({
      message: "Assignment updated successfully",
      assignment,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error updating assignment",
      error: err.message,
    });
  }
};

// DELETE ASSIGNMENT
exports.deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    await Course.findByIdAndUpdate(assignment.course, {
      $pull: { assignments: assignment._id },
    });

    await Submission.deleteMany({ assignmentId: assignment._id });
    await Assignment.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Assignment deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error deleting assignment",
      error: err.message,
    });
  }
};