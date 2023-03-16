const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const {
    getStudentFees,
    exportStudentFeesToCSV,
    changePaidStatus,
    changeSubjectFee,
    getSingleFee,
    getActiveFees,
    getStudentActiveInvoice,
    changeFeeDueDate,
} = require("../controllers/fees.controller");

const router = express.Router();

router.get("/fees/:student_id", verifyToken, getStudentFees);
router.get(
    "/fees/export-to-csv/:student_id",
    verifyToken,
    exportStudentFeesToCSV
);
router.patch("/fees/set-paid", verifyToken, changePaidStatus);
router.patch("/fees/change-subject-fee", verifyToken, changeSubjectFee);
router.get("/single-fee/:id", verifyToken, getSingleFee);
router.get("/active-fees", verifyToken, getActiveFees);
router.get("/active-invoice/:studentid", verifyToken, getStudentActiveInvoice);
router.patch("/fees/change-due-date/:id", verifyToken, changeFeeDueDate);

module.exports = router;
