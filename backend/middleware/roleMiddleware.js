// Role-based access control middleware

// Only Admin
exports.isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: "No user found (Unauthorized)" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied (Admin only)" });
    }

    next();
  } catch (err) {
    res.status(500).json({ msg: "Error in isAdmin middleware" });
  }
};

// Only Student
exports.isStudent = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: "No user found (Unauthorized)" });
    }

    if (req.user.role !== "student") {
      return res.status(403).json({ msg: "Access denied (Student only)" });
    }

    next();
  } catch (err) {
    res.status(500).json({ msg: "Error in isStudent middleware" });
  }
};

//  Allowing both 
exports.isAuthenticated = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    next();
  } catch (err) {
    res.status(500).json({ msg: "Auth middleware error" });
  }
};