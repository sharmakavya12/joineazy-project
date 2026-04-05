const Assignment = require("../models/Assignment");
const Group = require("../models/Group");
const Submission = require("../models/Submission");
const Course = require("../models/Course");

// PROFESSOR DASHBOARD
exports.getDashboard = async (req, res) => {
  try {
    // Only professor's own courses and assignments
    const courses = await Course.find({ professor: req.user.id })
      .populate("students", "_id")
      .lean();

    const courseIds = courses.map((c) => c._id);
    const totalStudents = new Set(
      courses.flatMap((c) => c.students.map((s) => s._id.toString()))
    ).size;

    const assignments = await Assignment.find({ createdBy: req.user.id }).lean();
    const assignmentIds = assignments.map((a) => a._id);

    const totalGroups = await Group.countDocuments({
      assignment: { $in: assignmentIds },
    });

    // Per-assignment stats
    const assignmentStats = await Promise.all(
      assignments.map(async (assignment) => {
        const course = courses.find(
          (c) => c._id.toString() === assignment.course?.toString()
        );
        const enrolledCount = course ? course.students.length : 0;

        if (assignment.submissionType === "group") {
          // For group assignments count unique groups that submitted
          const submittedGroups = await Submission.distinct("groupId", {
            assignmentId: assignment._id,
            confirmed: true,
            groupId: { $ne: null },
          });

          const totalGroups = await Group.countDocuments({
            assignment: assignment._id,
          });

          return {
            assignmentId: assignment._id,
            title: assignment.title,
            submissionType: "group",
            deadline: assignment.deadline,
            totalGroups,
            submittedGroups: submittedGroups.length,
            pendingGroups: Math.max(0, totalGroups - submittedGroups.length),
          };
        } else {
          // For individual: count unique students who submitted
          const submittedStudents = await Submission.distinct("studentId", {
            assignmentId: assignment._id,
            confirmed: true,
            studentId: { $ne: null },
          });

          return {
            assignmentId: assignment._id,
            title: assignment.title,
            submissionType: "individual",
            deadline: assignment.deadline,
            enrolledStudents: enrolledCount,
            submittedStudents: submittedStudents.length,
            pendingStudents: Math.max(0, enrolledCount - submittedStudents.length),
          };
        }
      })
    );

    // Recent submissions (last 10)
    const recentSubmissions = await Submission.find({
      assignmentId: { $in: assignmentIds },
    })
      .sort({ confirmedAt: -1 })
      .limit(10)
      .populate("studentId", "name email")
      .populate("assignmentId", "title submissionType")
      .populate("groupId", "name")
      .lean();

    return res.status(200).json({
      overview: {
        totalCourses: courses.length,
        totalAssignments: assignments.length,
        totalStudents,
        totalGroups,
      },
      assignmentStats,
      recentSubmissions,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error fetching dashboard",
      error: err.message,
    });
  }
};