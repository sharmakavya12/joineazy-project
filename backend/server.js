const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

// middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "*"
}));
app.use(express.json());

// DB connect
connectDB();

// routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/groups", require("./routes/groupRoutes"));
app.use("/api/assignments", require("./routes/assignmentRoutes"));
app.use("/api/submissions", require("./routes/submissionRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// test route
app.get("/", (req, res) => {
  res.send("Backend running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});