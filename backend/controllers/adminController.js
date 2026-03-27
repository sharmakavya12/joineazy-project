// const Assignment = require("../models/Assignment");
// const Group = require("../models/Group");
// const Submission = require("../models/Submission");
// const User = require("../models/User");
// const bcrypt = require("bcryptjs");

// exports.createAdmin = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // validation
//     if (!name || !email || !password) {
//       return res.status(400).json({ msg: "All fields required" });
//     }

//     // check existing
//     const existing = await User.findOne({ email });
//     if (existing) {
//       return res.status(400).json({ msg: "User already exists" });
//     }

//     // hash password
//     const hashed = await bcrypt.hash(password, 10);

//     // create admin
//     const admin = await User.create({
//       name,
//       email,
//       password: hashed,
//       role: "admin",
//     });

//     res.json({
//       id: admin._id,
//       name: admin.name,
//       email: admin.email,
//       role: admin.role,
//     });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };
// exports.getDashboard = async (req, res) => {
//   try {
//     const totalAssignments = await Assignment.countDocuments();
//     const totalGroups = await Group.countDocuments();
//     const totalSubmissions = await Submission.countDocuments();

//     res.json({
//       totalAssignments,
//       totalGroups,
//       totalSubmissions,
//     });
//   } catch (err) {
//     res.status(500).json({ msg: "Error fetching dashboard" });
//   }
// };

const Assignment = require("../models/Assignment");
const Group = require("../models/Group");
const Submission = require("../models/Submission");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Dashboard
exports.getDashboard = async (req, res) => {
  try {
    const totalAssignments = await Assignment.countDocuments();
    const totalGroups = await Group.countDocuments();
    const totalSubmissions = await Submission.countDocuments();

    const assignments = await Assignment.find();

    const assignmentStats = await Promise.all(
      assignments.map(async (a) => {
        const count = await Submission.countDocuments({
          assignmentId: a._id,
        });

        return {
          title: a.title,
          submissions: count,
        };
      })
    );

    res.json({
      totalAssignments,
      totalGroups,
      totalSubmissions,
      assignmentStats,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Create Admin
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email,
      password: hashed,
      role: "admin",
    });

    res.json({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};