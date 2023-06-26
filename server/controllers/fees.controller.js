const sendError = require('../utils/sendError');
const Fees = require('../models/fees.model');
const { Subject } = require('../models/subject.model');
const Student = require('../models/student.model');
const dayjs = require('dayjs');
const json2csv = require('json2csv').parse;
const { DUE_DATE_DAYS } = require('../config/constants');

module.exports.getStudentFees = async (req, res) => {
  const { student_id } = req.params;

  if (!student_id) return sendError(404, 'Student id required', res);

  try {
    const fees = await Fees.find({ student: student_id }).populate(['student']);
    if (!fees) return sendError(404, "Fees doesn't exists", res);
    return res.status(200).json({
      fees,
    });
  } catch (err) {
    sendError(500, 'Something went wrong', res);
  }
};
module.exports.exportStudentFeesToCSV = async (req, res) => {
  if (req.user.user_type !== 'admin')
    return sendError(401, 'Only Admins are allowed', res);

  const { student_id } = req.params;

  if (!student_id) return sendError(400, 'Please provide student id', res);

  try {
    const fees = await Fees.find({}, { password: 0 }).populate(['student']);

    if (!fees) return sendError(404, "Fees doesn't exists", res);

    const csv = json2csv(fees);

    return res.status(200).json({
      exported: csv,
    });
  } catch (err) {
    console.log(err);
    sendError(500, 'Something went wrong', res);
  }
};
module.exports.changePaidStatus = async (req, res) => {
  if (req.user.user_type !== 'admin')
    return sendError(401, 'Only Admins are alloed', res);

  const { fee_id: id, isPaid } = req.body;

  if (!id) return sendError(400, 'Please provide the fee id', res);
  if (!isPaid) return sendError(400, "Required fields can't be empty", res);

  const fee = await Fees.findById(id).populate('subjects');
  if (!fee) return sendError(404, 'Fee not found', res);

  try {
    if (isPaid === 'Paid') {
      if (fee.isActive) {
        const student = await Student.findById(fee.student._id);
        student.last_payment_date = Date.now();

        let created_fee;
        if (student.status === 'Active') {
          const all_subjects = await Subject.find({
            student_id: fee.student._id,
          });
          const due_date = dayjs(fee.due_date).add(DUE_DATE_DAYS, 'day');

          created_fee = await Fees.create({
            subjects: all_subjects,
            student: fee.student._id,
            due_date: due_date,
            payment_reminder: dayjs(fee.due_date)
              .add(DUE_DATE_DAYS, 'day')
              .subtract(10, 'day'),
            previous_due_date: fee.due_date,
            isActive: true,
          });
        }

        if (student.status === 'Active') {
          student.active_invoice = created_fee._id;
        }
        fee.isActive = false;

        await student.save();
      }
    }
    fee.isPaid = isPaid;

    await fee.save();

    return res.status(200).json({
      message: 'Success',
    });
  } catch (err) {
    sendError(500, 'Something went wrong', res);
  }
};
module.exports.changeSubjectFee = async (req, res) => {
  if (req.user.user_type !== 'admin')
    return sendError(401, 'Only Admins are alloed', res);

  const { fee_id, subject_id, fee_amount } = req.body;

  if (!fee_amount) return sendError(400, 'Please provide the fee amount', res);
  if (!fee_id) return sendError(400, 'Please provide the fee id', res);
  if (!subject_id) return sendError(400, 'Please provide the subject id', res);

  const fee = await Fees.findById(fee_id);

  if (!fee) {
    return sendError(404, "Fee doesn't exists", res);
  }

  try {
    fee.subjects = fee.subjects.map((sub) => {
      if (sub._id.toString() === String(subject_id)) {
        sub.monthly_payment = fee_amount;
      }
      return sub;
    });
    await fee.save();

    return res.status(200).json({
      message: 'Success',
    });
  } catch (err) {
    console.log(err);
    sendError(500, 'Something went wrong', res);
  }
};
module.exports.getSingleFee = async (req, res) => {
  const id = req.params.id;

  try {
    const fee = await Fees.findById(id).populate(['student']);

    if (!fee) return sendError(404, "Fee doesn't exists with that ID", res);

    return res.status(200).json({
      fee,
    });
  } catch (err) {
    sendError(500, 'Something went wrong', res);
  }
};
module.exports.getActiveFees = async (req, res) => {
  try {
    const fees = await Fees.find({ isActive: true }).populate(['student']);
    if (!fees) return sendError(404, "Fees doesn't exists", res);
    return res.status(200).json({
      fees,
    });
  } catch (err) {
    sendError(500, 'Something went wrong', res);
  }
};
module.exports.getStudentLatestIssuedDueInvoice = async (req, res) => {
  const { studentid } = req.params;
  try {
    const issuedDueInvoice = await Fees.findOne({
      isActive: true,
      student: studentid,
      issued: {
        $ne: null,
      },
    });
    return res.status(200).json({
      issuedDueInvoice,
    });
  } catch (err) {
    sendError(500, 'Something went wrong', res);
  }
};
module.exports.changeFeeDueDate = async (req, res) => {
  if (req.user.user_type !== 'admin')
    return sendError(401, 'Only Admins are alloed', res);

  const { id } = req.params;

  const { due_date } = req.body;

  if (!due_date) return sendError(400, 'Due date required', res);

  const fees = await Fees.findById(id);

  if (!fees) return sendError(404, "Fees doesn't exists", res);

  if (!fees.isActive)
    return sendError(
      400,
      'You can only edit the due date of the current active invoice'
    );

  fees.previous_due_date = fees.due_date;
  fees.due_date = due_date;
  fees.payment_reminder = dayjs(due_date).subtract(10, 'day');

  try {
    await fees.save();
    res.status(200).json({
      message: 'Success',
    });
  } catch (err) {
    sendError(500, 'Something went wrong', res);
  }
};

module.exports.setInternalComment = async (req, res) => {
  if (req.user.user_type !== 'admin')
    return sendError(401, 'Only Admins are alloed', res);

  const { fee_id: id, internal_comment } = req.body;

  if (!id) return sendError(400, 'Please provide the fee id', res);

  const fee = await Fees.findById(id).populate('subjects');
  if (!fee) return sendError(404, 'Fee not found', res);

  try {
    fee.internal_comment = internal_comment;
    await fee.save();

    return res.status(200).json({
      message: 'Success',
    });
  } catch (err) {
    sendError(500, 'Something went wrong', res);
  }
};
module.exports.setComment = async (req, res) => {
  if (req.user.user_type !== 'admin')
    return sendError(401, 'Only Admins are alloed', res);

  const { fee_id: id, comment } = req.body;

  if (!id) return sendError(400, 'Please provide the fee id', res);

  const fee = await Fees.findById(id).populate('subjects');
  if (!fee) return sendError(404, 'Fee not found', res);

  try {
    fee.comment = comment;
    await fee.save();

    return res.status(200).json({
      message: 'Success',
    });
  } catch (err) {
    sendError(500, 'Something went wrong', res);
  }
};
