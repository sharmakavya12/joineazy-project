const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const { getStudentDashboard } = require("../controllers/studentController");

// Student dashboard
router.get("/dashboard", auth, allowRoles("student"), getStudentDashboard);

module.exports = router;