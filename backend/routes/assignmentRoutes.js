const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");

//  IMPORT 
const {
  createAssignment,
  getAssignments,
} = require("../controllers/assignmentController");

// admin create
router.post("/create", auth, isAdmin, createAssignment);

// get all assignments
router.get("/", auth, getAssignments);

module.exports = router;