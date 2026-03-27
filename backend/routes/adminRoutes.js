// const express = require("express");
// const router = express.Router();

// const auth = require("../middleware/authMiddleware");
// const { isAdmin } = require("../middleware/roleMiddleware");

// const { getDashboard } = require("../controllers/adminController");
// const { createAdmin } = require("../controllers/adminController");

// router.post("/create-admin", auth, isAdmin, createAdmin);
// router.get("/dashboard", auth, isAdmin, getDashboard);

// module.exports = router;

const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");

const {
  getDashboard,
  createAdmin,
} = require("../controllers/adminController");

router.get("/dashboard", auth, isAdmin, getDashboard);
router.post("/create-admin", auth, isAdmin, createAdmin);

module.exports = router;