const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const Admin = require("../models/admin.model");
const sendError = require("../utils/sendError");
const json2csv = require("json2csv").parse;

const router = express.Router();

router.get("/admins", verifyToken, async (req, res) => {
    const admins = await Admin.find(
        {},
        {
            password: 0,
        }
    );

    res.status(200).json({
        admins: admins,
    });
});

router.get("/admins/export-to-csv", verifyToken, async (req, res) => {
    if (req.user.user_type !== "admin")
        return sendError(401, "Only Admins are allowed", res);

    try {
        const admins = await Admin.find({}, { password: 0 });

        const csv = json2csv(admins);

        return res.status(200).json({
            exported: csv,
        });
    } catch (err) {
        sendError(500, "Something went wrong", res);
    }
});

router.post("/admins", verifyToken, async (req, res) => {
    const { name, username, email, password } = req.body;

    if (req.user.user_type !== "admin")
        return sendError(401, "Only Admins are allowed", res);

    if (!name || !username || !email || !password)
        return sendError(400, "All fields are required!", res);

    const isEmailExist = await Admin.findOne({ email });
    if (isEmailExist) return sendError(400, "Email already exists", res);

    const isUsernameExists = await Admin.findOne({ username });
    if (isUsernameExists) return sendError(400, "Username already exists", res);

    const newAdmin = new Admin({
        name,
        email,
        username,
        password,
    });

    try {
        await newAdmin.save();
        res.status(201).json({
            message: "New admin created",
        });
    } catch (err) {
        res.status(500).json({
            message: "Something went wrong",
        });
    }
});

router.put("/admins/:id", verifyToken, async (req, res) => {
    const { name, username, email, _id: id } = req.body;

    if (req.user.user_type !== "admin")
        return sendError(401, "Only Admins are allowed", res);

    if (!name || !username || !email)
        return sendError(400, "All fields are required!", res);

    const user = await Admin.findById(id);

    if (email != user.email) {
        const isEmailExists = await Admin.find({
            email,
        });

        if (isEmailExists.length > 0)
            return sendError(400, "Email already exists", res);
    }

    try {
        await Admin.findByIdAndUpdate(id, {
            $set: {
                name: name,
                username: username,
                email: email,
            },
        });
        res.status(201).json({
            message: "Admin has been modified",
        });
    } catch (err) {
        res.status(500).json({
            message: "Something went wrong",
        });
    }
});

router.delete("/admins/:id", verifyToken, async (req, res) => {
    if (req.user.user_type !== "admin")
        return sendError(401, "Only Admins allowed", res);
    const user = await Admin.findById(req.params.id);

    if (!user) return sendError(404, "Admin doesn't exists", res);

    try {
        await Admin.findByIdAndDelete(req.params.id);
        res.status(201).json({
            message: "Admin has been deleted",
        });
    } catch (err) {
        res.status(500).json({
            message: "Something went wrong",
        });
    }
});

module.exports = router;
