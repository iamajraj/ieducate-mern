const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const upload = require("../utils/upload");
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
    createStudentGeneralReport,
    getStudentGeneralReports,
    getStudentSingleGeneralReport,
    deleteStudentGeneralReport,
    updateStudentGeneralReport,
    getStudentRecentGeneralReport,
    createTestReport,
    deleteStudentTestReport,
    updateStudentTestReport,
    getStudentRecentTestReport,
    getStudentTestReport,
    getStudentSingleTestReport,
    getStudentAllTestReports,
} = require("../controllers/student.controller");

const router = express.Router();

router.post("/students", verifyToken, createStudent);
router.put("/students/:id", verifyToken, updateStudent);
router.get("/students/invoices/:student_id", verifyToken, getStudentInvoices);
router.patch("/students/change-password", verifyToken, changeStudentPassword);
router.delete("/students/:id", verifyToken, deleteStudent);
router.get("/students", verifyToken, getStudents);
router.get("/students/export-to-csv", verifyToken, exportStudentsToCSV);
router.get("/students/:id", verifyToken, getStudent);
router.post("/students/issue-invoice", verifyToken, studentIssueInvoice);
router.get("/students/:id/reports", verifyToken, getStudentReports);

// teacher specific reports
router.get(
    "/students/single-teacher-reports/:id",
    verifyToken,
    studentSingleTeacherReports
);

// GENERAL REPORT
router.post(
    "/students/general-report",
    verifyToken,
    createStudentGeneralReport
);
router.get(
    "/students/general-reports/:student_id",
    verifyToken,
    getStudentGeneralReports
);

router.get(
    "/students/general-report/:reportid",
    verifyToken,
    getStudentSingleGeneralReport
);

router.delete(
    "/students/general-report/:reportid",
    verifyToken,
    deleteStudentGeneralReport
);
router.put(
    "/students/general-report/:reportid",
    verifyToken,
    updateStudentGeneralReport
);

router.get(
    "/students/general-report/recent/:studentId",
    verifyToken,
    getStudentRecentGeneralReport
);

// TEST REPORT
router.post(
    "/students/test-report",
    verifyToken,
    upload.array("feedback_files[]"),
    createTestReport
);
router.get(
    "/students/test-report/:reportid",
    verifyToken,
    getStudentTestReport
);
router.delete(
    "/students/test-report/:reportid",
    verifyToken,
    deleteStudentTestReport
);
router.put(
    "/students/test-report/:reportid",
    upload.array("feedback_files[]"),
    verifyToken,
    updateStudentTestReport
);

router.get(
    "/students/test-report/recent/:studentId",
    verifyToken,
    getStudentRecentTestReport
);

router.get(
    "/students/test-reports/single/:id",
    verifyToken,
    getStudentSingleTestReport
);

router.get(
    "/students/test-reports/:student_id",
    verifyToken,
    getStudentAllTestReports
);

module.exports = router;
