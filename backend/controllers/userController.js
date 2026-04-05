const User = require("../models/User");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "student" }).select("name email role");

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: err.message,
    });
  }
};