const express = require("express");
const sendError = require("../utils/sendError");
const Admin = require("../models/admin.model");
const Teacher = require("../models/teacher.model");
const { jwtSign } = require("../utils/jwtService");

const router = express.Router();

router.post("/admin/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return sendError(400, "All fields are required", res);

    const admin = await Admin.findOne({
        email: email,
    });

    if (!admin) return sendError(404, "Account doesn't exist.", res);

    const isValidPassword = await admin.validatePassword(password);

    if (!isValidPassword)
        return sendError(400, "Email or Password is invalid", res);

    const token = jwtSign(admin.toJSON());

    res.status(200).json({
        token,
        user: {
            id: admin._id,
            username: admin.username,
            email: admin.email,
            name: admin.name,
            user_type: admin.user_type,
        },
    });
});

router.post("/teacher/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return sendError(400, "All fields are required", res);

    const teacher = await Teacher.findOne({
        email: email,
    });

    if (!teacher) return sendError(404, "Account doesn't exist.", res);

    const isValidPassword = await teacher.validatePassword(password);

    if (!isValidPassword)
        return sendError(400, "Email or Password is invalid", res);

    const token = jwtSign({
        user_type: teacher.user_type,
        _id: teacher._id,
    });

    res.status(200).json({
        token,
        user: {
            id: teacher._id,
            username: teacher.username,
            email: teacher.email,
            name: teacher.name,
            user_type: teacher.user_type,
        },
    });
});

module.exports = router;
