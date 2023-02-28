const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const Student = require("../models/student.model");
const sendError = require("../utils/sendError");
const dayjs = require("dayjs");

const router = express.Router();

router.post("/students", verifyToken, async (req, res) => {
    if (req.user.user_type !== "admin")
        return sendError(401, "Only Admins are allowed", res);

    let {
        student_roll_no,
        student_name,
        student_address,
        student_telephone,
        emergency_name,
        emergency_contact_number,
        email,
        learning_support_needs,
        year,
        number_of_subject,
        subjects,
        registration_date,
        registration_amount,
        status,
    } = req.body;

    if (
        (!student_roll_no,
        !student_name,
        !student_address,
        !student_telephone,
        !emergency_name,
        !emergency_contact_number,
        !email,
        !learning_support_needs,
        !year,
        !registration_amount)
    )
        return sendError(400, "Required fields can't be empty", res);

    const isEmailExists = await Student.findOne({ email });

    if (isEmailExists) return sendError(400, "Email already exists", res);

    if (subjects !== null) {
        subjects = subjects.map((sub) => {
            return {
                subject_name: sub.subject_name,
                timetable: sub.timetable,
                monthly_payment: sub.monthly_payment,
                first_lesson_date: sub.first_lesson_date,
                due_date: dayjs().add(30, "day"),
            };
        });
    }

    const student = new Student({
        student_roll_no,
        student_name,
        student_address,
        student_telephone,
        emergency_name,
        emergency_contact_number,
        email,
        learning_support_needs,
        year,
        number_of_subject,
        subjects: subjects?.length > 0 ? subjects : [],
        registration_date: registration_date ?? new Date().toISOString(),
        registration_amount,
        status,
    });

    try {
        await student.save();

        res.status(201).json({
            message: "Student has been created",
            student,
        });
    } catch (err) {
        res.status(500).json({
            message: "Something went wrong",
        });
    }
});

router.get("/students", verifyToken, async (req, res) => {
    try {
        const students = await Student.find({}, { password: 0 });
        return res.status(200).json({
            students,
        });
    } catch (err) {
        sendError(500, "Something went wrong", res);
    }
});

module.exports = router;
