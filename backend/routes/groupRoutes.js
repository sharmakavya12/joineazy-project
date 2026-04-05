const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const {
  createGroup,
  getMyGroup,
  getGroupsByAssignment,
} = require("../controllers/groupController");

// Create group - student only
router.post("/", auth, allowRoles("student"), createGroup);

// Get my groups - student
router.get("/my-group", auth, allowRoles("student"), getMyGroup);

// Get all groups for an assignment - professor
router.get(
  "/assignment/:assignmentId",
  auth,
  allowRoles("professor"),
  getGroupsByAssignment
);

module.exports = router;