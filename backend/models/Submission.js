const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    submitted: {
      type: Boolean,
      default: false,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    // For group assignments: set true when group leader acknowledges
    // For individual: always false (student confirms themselves)
    acknowledgedByLeader: {
      type: Boolean,
      default: false,
    },
    confirmedAt: {
      type: Date,
      default: null,
    },
confirmedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    oneDriveLink: {
      type: String,
      default: "",
    },
    submissionTitle: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Prevent duplicate individual submissions
submissionSchema.index(
  { assignmentId: 1, studentId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      studentId: { $type: "objectId" },
      groupId: null,
    },
  }
);

// Prevent duplicate group submissions per member
submissionSchema.index(
  { assignmentId: 1, groupId: 1, studentId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      groupId: { $type: "objectId" },
    },
  }
);

module.exports = mongoose.model("Submission", submissionSchema);