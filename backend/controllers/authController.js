// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// // REGISTER
// exports.register = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     // check existing user
//     const existing = await User.findOne({ email });
//     if (existing) {
//       return res.status(400).json({ msg: "User already exists" });
//     }

//     // hash password
//     const hashed = await bcrypt.hash(password, 10);

//     // create user
//     const user = await User.create({
//       name,
//       email,
//       password: hashed,
//       role,
//     });

//     res.json({
//   id: user._id,
//   name: user.name,
//   email: user.email,
//   role: user.role,
// });
//   } catch (err) {
//     res.status(500).json({ msg: "Error registering user" });
//   }
// };

// // LOGIN
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ msg: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ msg: "Wrong password" });
//     }

//  const token = jwt.sign(
//   { id: user._id, role: user.role },
//   process.env.JWT_SECRET,
//   { expiresIn: "1d" }
// );

//     res.json({ token, user });
//   } catch (err) {
//     res.status(500).json({ msg: "Error logging in" });
//   }
// };

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
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

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: "student",
    });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Wrong password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};