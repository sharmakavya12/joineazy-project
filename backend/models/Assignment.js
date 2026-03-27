// const jwt = require("jsonwebtoken");

// module.exports = (req, res, next) => {
//   const token = req.headers.authorization;

//   if (!token) return res.status(401).json({ msg: "No token" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch {
//     res.status(401).json({ msg: "Invalid token" });
//   }
// };

const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    dueDate: Date,
    oneDriveLink: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assignment", assignmentSchema);