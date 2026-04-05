const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
} = require("../controllers/assignmentController");

// Create assignment - professor only
router.post("/", auth, allowRoles("professor"), createAssignment);

// Get all assignments
router.get("/", auth, getAssignments);

// Get single assignment
router.get("/:id", auth, getAssignmentById);

// Update assignment - professor only
router.patch("/:id", auth, allowRoles("professor"), updateAssignment);

// Delete assignment - professor only
router.delete("/:id", auth, allowRoles("professor"), deleteAssignment);

module.exports = router;