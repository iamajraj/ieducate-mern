const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const sendError = require("../utils/sendError");
const Announcement = require("../models/announcement.model");
const Student = require("../models/student.model");
const { fork } = require("child_process");
const path = require("path");
const child = fork(
    path.resolve(__dirname, "..", "tasks", "sendAnnouncementMail.js")
);

const router = express.Router();

router.post("/announcements", verifyToken, async (req, res) => {
    if (req.user.user_type !== "admin")
        return sendError(401, "Only admins are allowed", res);

    const { title, description } = req.body;

    if (!title || !description)
        return sendError(400, "All fields are required", res);

    const new_announcement = new Announcement({
        title,
        description,
        created_by: req.user._id,
    });

    const students = await Student.find({}).select("email");

    child.send({ students, announcement: new_announcement });

    try {
        await new_announcement.save();
        return res.status(201).json({
            message: "Announcement has been created",
            announcement: new_announcement,
        });
    } catch (err) {
        return sendError(500, "Something went wrong", res);
    }
});

router.put("/announcements/:id", verifyToken, async (req, res) => {
    if (req.user.user_type !== "admin")
        return sendError(401, "Only admins are allowed", res);

    const { id } = req.params;

    const { title, description } = req.body;

    if (!title || !description)
        return sendError(400, "All fields are required", res);

    try {
        await Announcement.findByIdAndUpdate(id, {
            $set: {
                title,
                description,
            },
        });
        return res.status(201).json({
            message: "Announcement has been updated",
        });
    } catch (err) {
        return sendError(500, "Something went wrong", res);
    }
});
router.delete("/announcements/:id", verifyToken, async (req, res) => {
    if (req.user.user_type !== "admin")
        return sendError(401, "Only admins are allowed", res);

    const { id } = req.params;

    if (!id) return sendError(400, "Id are required", res);

    try {
        await Announcement.findByIdAndDelete(id);
        return res.status(201).json({
            message: "Announcement has been deleted",
        });
    } catch (err) {
        return sendError(500, "Something went wrong", res);
    }
});
router.get("/announcements", verifyToken, async (req, res) => {
    try {
        const announcements = await Announcement.find({}).populate(
            "created_by"
        );
        res.status(200).json({
            announcements,
        });
    } catch (err) {
        return sendError(500, "Something went wrong", res);
    }
});

module.exports = router;
