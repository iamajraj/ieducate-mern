const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const Teacher = require("../models/teacher.model");
const sendError = require("../utils/sendError");

const router = express.Router();

router.post("/teachers", verifyToken, async (req, res) => {
    if (req.user.user_type !== "admin")
        return sendError(401, "Only Admins are allowed", res);

    const { email, username, name, password, speciality } = req.body;

    if (!email || !username || !name || !password)
        return sendError(400, "Required fields can't be empty", res);

    const isEmailExists = await Teacher.findOne({ email });

    if (isEmailExists) sendError(400, "Email is already exists", res);

    // create teacher
    const teacher = new Teacher({
        name,
        username,
        email,
        password,
        speciality,
    });

    try {
        // save the teacher
        await teacher.save();

        return res.status(201).json({
            message: "Teacher has been created",
            teacher: teacher, // <- created teacher
        });
    } catch (err) {
        console.log(err);
        return sendError(500, "Something went wrong.", res);
    }
});

router.post("/teachers/set-attendance", verifyToken, async (req, res) => {
    if (req.user.user_type !== "admin")
        return sendError(401, "Only Admins are allowed", res);

    const { date, fromTime, toTime, teacher_id } = req.body;

    if (!date || !fromTime || !toTime || !teacher_id)
        return sendError(400, "Required fields can't be empty", res);

    const teacher = await Teacher.findById(teacher_id);

    if (!teacher) sendError(400, "Teacher doesn't exists", res);

    teacher.attendance.push({
        attendanceBy: req.user._id,
        date: date,
        fromTime: fromTime,
        toTime: toTime,
    });

    try {
        // save the teacher
        await teacher.save();

        return res.status(201).json({
            message: "Teacher attendance has been added",
            teacher: teacher, // <- created teacher
        });
    } catch (err) {
        console.log(err);
        return sendError(500, "Something went wrong.", res);
    }
});

router.get("/teachers", verifyToken, async (req, res) => {
    try {
        const teachers = await Teacher.find({}, { password: 0 });
        res.status(200).json({
            teachers,
        });
    } catch (err) {
        sendError(500, "Something went wrong", res);
    }
});

router.get("/teachers/:id", verifyToken, async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id, { password: 0 });
        res.status(200).json({
            teacher,
        });
    } catch (err) {
        sendError(500, "Something went wrong", res);
    }
});

router.put("/teachers/:id", verifyToken, async (req, res) => {
    const { name, username, email, speciality, _id: id } = req.body;
    if (req.user.user_type !== "admin" && req.user.user_type !== "teacher")
        return sendError(401, "Only Admins are allowed", res);

    if (!name || !username || !email)
        return sendError(400, "All fields are required!", res);

    const user = await Teacher.findById(id);

    if (email != user.email) {
        const isEmailExists = await Teacher.find({
            email,
        });

        if (isEmailExists.length > 0)
            return sendError(400, "Email already exists", res);
    }

    try {
        await Teacher.findByIdAndUpdate(id, {
            $set: {
                name: name,
                username: username,
                email: email,
                speciality: speciality,
            },
        });
        res.status(201).json({
            message: "Teacher has been modified",
        });
    } catch (err) {
        res.status(500).json({
            message: "Something went wrong",
        });
    }
});

router.delete("/teachers/:id", verifyToken, async (req, res) => {
    if (req.user.user_type !== "admin")
        return sendError(401, "Only Admins allowed", res);

    const user = await Teacher.findById(req.params.id);

    if (!user) return sendError(404, "Teacher doesn't exists", res);

    try {
        await Teacher.findByIdAndDelete(req.params.id);
        res.status(201).json({
            message: "Teacher has been deleted",
        });
    } catch (err) {
        res.status(500).json({
            message: "Something went wrong",
        });
    }
});

module.exports = router;