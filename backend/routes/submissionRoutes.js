const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const { confirmSubmission } = require("../controllers/submissionController");

router.post("/confirm", auth, confirmSubmission);

module.exports = router;