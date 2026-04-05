# Submission Details Modal Plan

**Goal**: Popup form before submit (OneDrive link, name, notes)

**Backend Changes:**
1. `models/Submission.js`: Add fields:
   - oneDriveLink: String
   - submissionTitle: String (required)
   - notes: String

2. `controllers/submissionController.js`: Save from req.body in confirmSubmission

**Frontend Changes:**
1. `pages/StudentDashboard.jsx`: Add modal, change button to open modal
2. `pages/CoursePage.jsx`: Same for detail page

**Followup:**
- Restart backend
- Test modal + submit
- Verify DB has link/title
