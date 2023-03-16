const express = require("express");
const {
    exportTeachersToCSV,
    createTeacher,
    setTeacherAttendance,
    deleteTeacherAttendance,
    getTeachers,
    getSingleTeacher,
    updateTeacher,
    deleteTeacher,
    updateTeacherCredentials,
} = require("../controllers/teacher.controller");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.post("/teachers", verifyToken, createTeacher);
router.get("/teachers/export-to-csv", verifyToken, exportTeachersToCSV);
router.post("/teachers/set-attendance", verifyToken, setTeacherAttendance);
router.delete(
    "/teachers/delete-attendance",
    verifyToken,
    deleteTeacherAttendance
);
router.get("/teachers", verifyToken, getTeachers);
router.get("/teachers/:id", verifyToken, getSingleTeacher);
router.put("/teachers/:id", verifyToken, updateTeacher);
router.delete("/teachers/:id", verifyToken, deleteTeacher);
router.patch(
    "/teachers/update-credentials",
    verifyToken,
    updateTeacherCredentials
);

module.exports = router;
