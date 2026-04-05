const mongoose = require("mongoose");
const Course = require("../models/Course");
const User = require("../models/User");

// CREATE COURSE
exports.createCourse = async (req, res) => {
  try {
    const { title, code } = req.body;

    if (!title || !code) {
      return res.status(400).json({ message: "Title and code are required" });
    }

    const existing = await Course.findOne({ code: code.toUpperCase().trim() });
    if (existing) {
      return res.status(400).json({ message: "Course with this code already exists" });
    }

    const course = await Course.create({
      title: title.trim(),
      code: code.toUpperCase().trim(),
      professor: req.user.id,
      students: [],
      assignments: [],
    });

    return res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (err) {
    return res.status(500).json({ message: "Error creating course", error: err.message });
  }
};

// GET ALL COURSES
// Professor: sirf apne courses
// Student: sirf enrolled courses
exports.getCourses = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "professor") {
      filter.professor = req.user.id;
    } else if (req.user.role === "student") {
      filter.students = req.user.id;
    }

    const courses = await Course.find(filter)
      .populate("professor", "name email")
      .populate("students", "name email")
      .populate({
        path: "assignments",
        select: "title deadline submissionType",
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Courses fetched successfully",
      courses,
    });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching courses", error: err.message });
  }
};

// GET COURSE BY ID
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const course = await Course.findById(id)
      .populate("professor", "name email")
      .populate("students", "name email")
      .populate({
        path: "assignments",
        select: "title description deadline submissionType oneDriveLink createdAt",
      });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Access check: student must be enrolled, professor must own it
    if (req.user.role === "student") {
      const isEnrolled = course.students.some(
        (s) => s._id.toString() === req.user.id
      );
      if (!isEnrolled) {
        return res.status(403).json({ message: "You are not enrolled in this course" });
      }
    }

    if (req.user.role === "professor") {
      if (course.professor._id.toString() !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    return res.status(200).json({
      message: "Course fetched successfully",
      course,
    });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching course", error: err.message });
  }
};

// ENROLL STUDENT IN COURSE (Professor only)
exports.enrollStudent = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { studentId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Valid studentId is required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.professor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only course professor can enroll students" });
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    const alreadyEnrolled = course.students.some(
      (s) => s.toString() === studentId
    );
    if (alreadyEnrolled) {
      return res.status(400).json({ message: "Student already enrolled in this course" });
    }

    await Course.findByIdAndUpdate(courseId, {
      $addToSet: { students: studentId },
    });

    return res.status(200).json({ message: "Student enrolled successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Error enrolling student", error: err.message });
  }
};

// SELF ENROLL (Student enrolls themselves using course code)
exports.selfEnroll = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Course code is required" });
    }

    const course = await Course.findOne({ code: code.toUpperCase().trim() });
    if (!course) {
      return res.status(404).json({ message: "Course not found with this code" });
    }

    const alreadyEnrolled = course.students.some(
      (s) => s.toString() === req.user.id
    );
    if (alreadyEnrolled) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    await Course.findByIdAndUpdate(course._id, {
      $addToSet: { students: req.user.id },
    });

    return res.status(200).json({ message: "Enrolled successfully", courseId: course._id });
  } catch (err) {
    return res.status(500).json({ message: "Error enrolling", error: err.message });
  }
};