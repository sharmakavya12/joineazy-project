const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const {
  confirmSubmission,
  getSubmissions,
  getMySubmissionStatus : getSubmissionStatus
} = require("../controllers/submissionController");

router.post("/:assignmentId/confirm", auth, confirmSubmission);
router.get("/", auth, allowRoles("student", "professor"), getSubmissions);
router.get("/:assignmentId/status", auth, getSubmissionStatus);



module.exports = router;