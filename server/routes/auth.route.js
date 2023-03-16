const express = require("express");
const {
    loginAdmin,
    loginTeacher,
    loginStudent,
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/admin/login", loginAdmin);
router.post("/teacher/login", loginTeacher);
router.post("/student/login", loginStudent);

module.exports = router;
