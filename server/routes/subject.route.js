const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const Subject = require("../models/subject.model");
const sendError = require("../utils/sendError");

const router = express.Router();

// router.post(
//     "/subject/change-monthly-payment/:id",
//     verifyToken,
//     async (req, res) => {
//         if (req.user.user_type !== "admin")
//             return sendError(401, "Only Admins are allowed", res);

//         const { monthly_payment } = req.body;

//         if (!monthly_payment)
//             return sendError(400, "Please provide monthly payment", res);

//         const subject = await Subject.findById(req.params.id);

//         if (!subject) return sendError(404, "Subject not found", res);

//         try {
//             subject.monthly_payment = monthly_payment;
//             await subject.save();

//             res.status(200).json({
//                 message: "success",
//             });
//         } catch (err) {
//             sendError(500, "Something went wrong", res);
//         }
//     }
// );

module.exports = router;
