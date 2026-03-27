// const Submission = require("../models/Submission");

// // confirm submission
// exports.confirmSubmission = async (req, res) => {
//   try {
//     const { groupId, assignmentId } = req.body;

//     // duplicate check
//     const existing = await Submission.findOne({ groupId, assignmentId });

//     if (existing) {
//       return res.status(400).json({ msg: "Already submitted" });
//     }

//     // create submission
//     const submission = await Submission.create({
//       groupId,
//       assignmentId,
//       confirmed: true,
//       confirmedAt: new Date(),
//     });

//     res.json(submission);
//   } catch (err) {
//     res.status(500).json({ msg: "Error confirming submission" });
//   }
// };

const Submission = require("../models/Submission");

exports.confirmSubmission = async (req, res) => {
  try {
    const { groupId, assignmentId } = req.body;

    const existing = await Submission.findOne({ groupId, assignmentId });
    if (existing) {
      return res.status(400).json({ msg: "Already submitted" });
    }

    const submission = await Submission.create({
      groupId,
      assignmentId,
      confirmed: true,
      confirmedAt: new Date(),
      confirmedBy: req.user.id,
    });

    res.json(submission);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};