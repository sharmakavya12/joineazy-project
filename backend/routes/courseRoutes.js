const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const {
  createCourse,
  getCourses,
  getCourseById,
  enrollStudent,
  selfEnroll,
} = require("../controllers/courseController");

// Create course - professor only
router.post("/", auth, allowRoles("professor"), createCourse);

// Get all courses (filtered by role automatically)
router.get("/", auth, getCourses);

// Get single course
router.get("/:id", auth, getCourseById);

// Professor enrolls a student
router.post("/:courseId/enroll", auth, allowRoles("professor"), enrollStudent);

// Student self-enrolls using course code
router.post("/enroll/self", auth, allowRoles("student"), selfEnroll);

module.exports = router;