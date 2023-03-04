const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const sendError = require("../utils/sendError");
const Fees = require("../models/fees.model");
const Subject = require("../models/subject.model");
const dayjs = require("dayjs");
const json2csv = require("json2csv").parse;

const router = express.Router();

router.get("/fees", verifyToken, async (req, res) => {
    if (req.user.user_type !== "admin")
        return sendError(401, "Only Admins are alloed", res);

    try {
        const fees = await Fees.find({}).populate(["student", "subjects"]);
        return res.status(200).json({
            fees,
        });
    } catch (err) {
        sendError(500, "Something went wrong", res);
    }
});

router.get("/fees/export-to-csv", verifyToken, async (req, res) => {
    if (req.user.user_type !== "admin")
        return sendError(401, "Only Admins are allowed", res);

    try {
        const fees = await Fees.find({}, { password: 0 }).populate([
            "student",
            "subjects",
        ]);

        const csv = json2csv(fees);

        return res.status(200).json({
            exported: csv,
        });
    } catch (err) {
        console.log(err);
        sendError(500, "Something went wrong", res);
    }
});

router.patch("/fees/set-paid", verifyToken, async (req, res) => {
    if (req.user.user_type !== "admin")
        return sendError(401, "Only Admins are alloed", res);

    const { fee_id: id, isPaid } = req.body;

    if (!id) return sendError(400, "Please provide the fee id", res);

    if (!isPaid) return sendError(400, "Required fields can't be empty", res);

    const fee = await Fees.findById(id).populate("subjects");

    if (!fee) return sendError(404, "Fee not found", res);

    try {
        if (isPaid === "Paid") {
            await Subject.updateMany(
                {
                    student_id: fee.student,
                },
                {
                    $set: {
                        last_payment_date: Date.now(),
                    },
                }
            );
            fee.previous_due_date = fee.due_date;
            fee.due_date = dayjs(fee.due_date).add(30, "day");
            fee.payment_reminder = dayjs(fee.due_date)
                .add(30, "day")
                .subtract(10, "day");
        }
        fee.isPaid = isPaid;
        await fee.save();

        return res.status(200).json({
            message: "Success",
        });
    } catch (err) {
        sendError(500, "Something went wrong", res);
    }
});

router.get("/fees/:id", verifyToken, async (req, res) => {
    const id = req.params.id;

    if (req.user.user_type !== "admin")
        return sendError(401, "Only Admins are alloed", res);

    try {
        const fee = await Fees.findById(id).populate(["student", "subjects"]);

        if (!fee) return sendError(404, "Fee doesn't exists with that ID", res);

        return res.status(200).json({
            fee,
        });
    } catch (err) {
        sendError(500, "Something went wrong", res);
    }
});

router.patch("/fees/change-due-date/:id", verifyToken, async (req, res) => {
    if (req.user.user_type !== "admin")
        return sendError(401, "Only Admins are alloed", res);

    const { id } = req.params;

    const { due_date } = req.body;

    if (!due_date) return sendError(400, "Due date required", res);

    const fees = await Fees.findById(id);

    if (!fees) return sendError(404, "Fees doesn't exists", res);

    fees.previous_due_date = fees.due_date;
    fees.due_date = due_date;
    fees.payment_reminder = dayjs(due_date).subtract(10, "day");

    try {
        await fees.save();
        res.status(200).json({
            message: "Success",
        });
    } catch (err) {
        sendError(500, "Something went wrong", res);
    }
});

module.exports = router;
