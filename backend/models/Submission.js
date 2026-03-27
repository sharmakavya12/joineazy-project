// const mongoose = require("mongoose");

// const submissionSchema = new mongoose.Schema({
//   groupId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Group",
//   },
//   assignmentId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Assignment",
//   },
//   confirmed: Boolean,
//   confirmedAt: Date,
// });

// module.exports = mongoose.model("Submission", submissionSchema);

const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
    },
    confirmed: Boolean,
    confirmedAt: Date,
    confirmedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);