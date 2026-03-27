const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  createGroup,
  getMyGroup,
} = require("../controllers/groupController");

router.post("/create", auth, createGroup);
router.get("/my-group", auth, getMyGroup);

module.exports = router;