const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const { getDashboard } = require("../controllers/professorController");

// Professor dashboard
router.get("/dashboard", auth, allowRoles("professor"), getDashboard);

module.exports = router;