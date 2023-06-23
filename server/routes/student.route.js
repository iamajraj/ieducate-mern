const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const upload = require('../utils/upload');
const {
  createStudent,
  updateStudent,
  getStudentInvoices,
  changeStudentPassword,
  deleteStudent,
  getStudents,
  exportStudentsToCSV,
  getStudent,
  studentIssueInvoice,
  getStudentReports,
  studentSingleTeacherReports,
  createTestReport,
  deleteStudentTestReport,
  updateStudentTestReport,
  getStudentRecentTestReport,
  getStudentTestReport,
  getStudentSingleTestReport,
  getStudentAllTestReports,
  createStudentClassActivity,
  getStudentClassActivity,
  deleteStudentClassActivity,
  updateStudentClassActivity,
  getStudentRecentClassActivity,
  getStudentSingleClassActivity,
  getStudentAllClassActivity,
  assignTeacherToStudent,
} = require('../controllers/student.controller');

const router = express.Router();

router.post('/students', verifyToken, createStudent);
router.get('/students', verifyToken, getStudents);
router.put('/students/update/:id', verifyToken, updateStudent);
router.delete('/students/delete/:id', verifyToken, deleteStudent);
router.get('/students/invoices/:student_id', verifyToken, getStudentInvoices);
router.patch('/students/change-password', verifyToken, changeStudentPassword);
router.get('/students/export-to-csv', verifyToken, exportStudentsToCSV);
router.post('/students/issue-invoice', verifyToken, studentIssueInvoice);
router.get('/students/:id/reports', verifyToken, getStudentReports);
router.put('/students/assign-teacher', verifyToken, assignTeacherToStudent);
router.get('/students/:id', verifyToken, getStudent);

// teacher specific reports
router.get(
  '/students/single-teacher-reports/:id',
  verifyToken,
  studentSingleTeacherReports
);

// TEST REPORT
router.post(
  '/students/test-report',
  verifyToken,
  upload.array('feedback_files[]'),
  createTestReport
);
router.get(
  '/students/test-report/:reportid',
  verifyToken,
  getStudentTestReport
);
router.delete(
  '/students/test-report/:reportid',
  verifyToken,
  deleteStudentTestReport
);
router.put(
  '/students/test-report/:reportid',
  upload.array('feedback_files[]'),
  verifyToken,
  updateStudentTestReport
);

router.get(
  '/students/test-report/recent/:studentId',
  verifyToken,
  getStudentRecentTestReport
);

router.get(
  '/students/test-reports/single/:id',
  verifyToken,
  getStudentSingleTestReport
);

router.get(
  '/students/test-reports/:student_id',
  verifyToken,
  getStudentAllTestReports
);

// CLASS ACTIVITY
router.post(
  '/students/class-activity',
  verifyToken,
  upload.array('attachments[]'),
  createStudentClassActivity
);
router.get(
  '/students/class-activity/:classActivityId',
  verifyToken,
  getStudentClassActivity
);
router.delete(
  '/students/class-activity/:classActivityId',
  verifyToken,
  deleteStudentClassActivity
);
router.put(
  '/students/class-activity/:classActivityId',
  upload.array('attachments[]'),
  verifyToken,
  updateStudentClassActivity
);

router.get(
  '/students/class-activity/recent/:studentId',
  verifyToken,
  getStudentRecentClassActivity
);

router.get(
  '/students/class-activity/single/:id',
  verifyToken,
  getStudentSingleClassActivity
);

router.get(
  '/students/class-activity/student/:student_id',
  verifyToken,
  getStudentAllClassActivity
);

module.exports = router;
