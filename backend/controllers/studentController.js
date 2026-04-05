const Course = require("../models/Course");
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const Group = require("../models/Group");

// STUDENT DASHBOARD
exports.getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user.id;

    // All enrolled courses
    const courses = await Course.find({ students: studentId })
      .populate("professor", "name email")
      .populate({
        path: "assignments",
        select: "title description deadline submissionType",
      })
      .lean();

    // All assignment IDs from enrolled courses
    const allAssignmentIds = courses.flatMap((c) =>
      c.assignments.map((a) => a._id)
    );

    // All submissions by this student
    const submissions = await Submission.find({
      studentId,
      assignmentId: { $in: allAssignmentIds },
    }).lean();

    const submittedMap = {};
    submissions.forEach((s) => {
      submittedMap[s.assignmentId.toString()] = {
        confirmed: s.confirmed,
        acknowledgedByLeader: s.acknowledgedByLeader,
        confirmedAt: s.confirmedAt,
      };
    });

    // All groups this student belongs to
    const groups = await Group.find({ members: studentId })
      .populate("leader", "name email")
      .populate("members", "name email")
      .populate("assignment", "title deadline submissionType")
      .lean();

    const groupMap = {};
    groups.forEach((g) => {
      if (g.assignment) {
        groupMap[g.assignment._id.toString()] = {
          groupId: g._id,
          groupName: g.name,
          isLeader: g.leader._id.toString() === studentId,
          members: g.members,
        };
      }
    });

    // Enrich each course's assignments with submission status
    const enrichedCourses = courses.map((course) => ({
      ...course,
      assignments: course.assignments.map((assignment) => {
        const aId = assignment._id.toString();
        return {
          ...assignment,
          submissionStatus: submittedMap[aId] || {
            confirmed: false,
            acknowledgedByLeader: false,
          },
          groupInfo: groupMap[aId] || null,
          isOverdue: new Date(assignment.deadline) < new Date(),
        };
      }),
    }));

    // Summary counts
    const totalAssignments = allAssignmentIds.length;
    const submittedCount = submissions.filter((s) => s.confirmed).length;

    return res.status(200).json({
      overview: {
        enrolledCourses: courses.length,
        totalAssignments,
        submittedAssignments: submittedCount,
        pendingAssignments: totalAssignments - submittedCount,
      },
      courses: enrichedCourses,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error fetching student dashboard",
      error: err.message,
    });
  }
};