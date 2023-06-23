const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const {
  getStudentFees,
  exportStudentFeesToCSV,
  changePaidStatus,
  changeSubjectFee,
  getSingleFee,
  getActiveFees,
  getStudentLatestIssuedDueInvoice,
  changeFeeDueDate,
  setInternalComment,
  setComment,
} = require('../controllers/fees.controller');

const router = express.Router();

router.get('/fees/:student_id', verifyToken, getStudentFees);
router.get(
  '/fees/export-to-csv/:student_id',
  verifyToken,
  exportStudentFeesToCSV
);
router.patch('/fees/set-paid', verifyToken, changePaidStatus);
router.patch('/fees/set-internal-comment', verifyToken, setInternalComment);
router.patch('/fees/set-comment', verifyToken, setComment);
router.patch('/fees/change-subject-fee', verifyToken, changeSubjectFee);
router.get('/single-fee/:id', verifyToken, getSingleFee);
router.get('/active-fees', verifyToken, getActiveFees);
router.get(
  '/latest-issued-due-invoice/:studentid',
  verifyToken,
  getStudentLatestIssuedDueInvoice
);
router.patch('/fees/change-due-date/:id', verifyToken, changeFeeDueDate);

module.exports = router;
