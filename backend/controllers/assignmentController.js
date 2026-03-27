const Assignment = require("../models/Assignment");

// create assignment (admin)
exports.createAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.json(assignment);
  } catch (err) {
    res.status(500).json({ msg: "Error creating assignment" });
  }
};

// get all assignments (student)
exports.getAssignments = async (req, res) => {
  try {
    const data = await Assignment.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching assignments" });
  }
};