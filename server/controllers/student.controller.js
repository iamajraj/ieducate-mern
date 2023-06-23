const sendError = require('../utils/sendError');
const dayjs = require('dayjs');
const Fees = require('../models/fees.model');
const json2csv = require('json2csv').parse;
const fsPromise = require('fs').promises;
const fs = require('fs');
const path = require('path');
const Student = require('../models/student.model');
const { Subject } = require('../models/subject.model');
const ClassActivity = require('../models/classActivity.model');
const TestReport = require('../models/testreport.model');
const mailService = require('../utils/mailService');
const isToday = require('dayjs/plugin/isToday');
const { DUE_DATE_DAYS } = require('../config/constants');

module.exports.createStudent = async (req, res) => {
  if (req.user.user_type !== 'admin')
    return sendError(401, 'Only Admins are allowed', res);

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
    password,
  } = req.body;

  if (
    !student_roll_no ||
    !student_name ||
    !student_address ||
    !student_telephone ||
    !emergency_name ||
    !emergency_contact_number ||
    !email ||
    !subjects ||
    !learning_support_needs ||
    !year ||
    !registration_amount ||
    !password
  )
    return sendError(400, "Required fields can't be empty", res);

  const isEmailExists = await Student.findOne({ email });

  if (isEmailExists) return sendError(400, 'Email already exists', res);

  const student = new Student({
    student_roll_no,
    student_name,
    student_address,
    student_telephone,
    emergency_name,
    emergency_contact_number,
    email: String(email).toLowerCase(),
    learning_support_needs,
    year,
    number_of_subject,
    registration_date: registration_date ?? new Date().toISOString(),
    registration_amount,
    status,
    password,
  });

  if (subjects !== null) {
    subjects = subjects.map((sub) => {
      return {
        student_id: student._id,
        subject_name: sub.subject_name,
        timetable: sub.timetable,
        monthly_payment: sub.monthly_payment,
        first_lesson_date: sub.first_lesson_date,
      };
    });
  }

  const created_subjects = await Subject.insertMany(subjects);
  const subject_ids = created_subjects.map((sub) => sub._id);
  student.subjects.push(...subject_ids);

  const due_date = dayjs(subjects[subjects.length - 1].first_lesson_date).add(
    DUE_DATE_DAYS,
    'day'
  );

  const payment_reminder_date = dayjs(
    subjects[subjects.length - 1].first_lesson_date
  )
    .add(DUE_DATE_DAYS, 'day')
    .subtract(10, 'day');

  const fees = await Fees.create({
    subjects: created_subjects,
    student: student._id,
    due_date: due_date,
    payment_reminder: payment_reminder_date,
    previous_due_date: dayjs(
      subjects[subjects.length - 1].first_lesson_date
    ).add(DUE_DATE_DAYS, 'day'),
    isActive: true,
  });

  try {
    student.active_invoice = fees._id;
    await student.save();

    res.status(201).json({
      message: 'Student has been created',
      student,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};
module.exports.updateStudent = async (req, res) => {
  const id = req.params.id;
  if (req.user.user_type !== 'admin')
    return sendError(401, 'Only Admins are allowed', res);

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
    registration_amount,
    number_of_subject,
    subjects,
    removed_subject_ids,
    new_subject_local_ids,
    status,
    password,
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

  const student = await Student.findById(id);

  if (!student) return sendError(404, 'Student ID is invalid', res);

  if (student.email !== email) {
    const isEmailExists = await Student.findOne({ email });
    if (isEmailExists) return sendError(400, 'Email already exists', res);
  }

  try {
    await student.updateOne({
      $set: {
        student_roll_no,
        student_name,
        student_address,
        student_telephone,
        emergency_name,
        emergency_contact_number,
        email,
        learning_support_needs,
        year,
        registration_amount,
        number_of_subject,
        status,
      },
    });

    if (password && password.trim() !== '') {
      student.password = password;
    }

    // set the subject ids
    let allSubjectIds = [];
    subjects.forEach(async (sub) => {
      if (sub._id) {
        allSubjectIds.push(sub._id);

        if (sub.isModified) {
          await Subject.findByIdAndUpdate(sub._id, {
            $set: {
              first_lesson_date: sub.first_lesson_date,
              timetable: sub.timetable,
              subject_name: sub.subject_name,
              monthly_payment: sub.monthly_payment,
            },
          });
        }
      }
    });

    await student.updateOne({
      $set: {
        subjects: allSubjectIds,
      },
    });

    if (removed_subject_ids?.length > 0) {
      await Subject.deleteMany({
        _id: {
          $in: removed_subject_ids.map((id) => String(id)),
        },
      });
    }

    if (new_subject_local_ids?.length > 0) {
      if (subjects !== null) {
        subjects = subjects.filter((sub) => Boolean(sub.local_id));
        subjects = subjects.map((sub) => {
          return {
            student_id: student._id,
            subject_name: sub.subject_name,
            timetable: sub.timetable,
            monthly_payment: sub.monthly_payment,
            first_lesson_date: sub.first_lesson_date,
            due_date: dayjs().add(30, 'day'),
          };
        });
        const created_subjects = await Subject.insertMany(subjects);
        // const fees = await Fees.findOne({
        //     student: student._id,
        // });
        // fees.subjects.push(created_subjects.map((sub) => sub._id));
        // fees.previous_due_date = fees.due_date;
        // fees.due_date = dayjs(
        //     subjects[subjects.length - 1].first_lesson_date
        // ).add(30, "day");
        // fees.payment_reminder = dayjs(
        //     subjects[subjects.length - 1].first_lesson_date
        // )
        // .add(30, "day")
        // .subtract(10, "day");
        // await fees.save();
        student.subjects.push(created_subjects.map((sub) => sub._id));
      }
    }

    // update fees
    const updated_subjects = await Subject.find({ student_id: id });
    const fees = await Fees.findOne({
      student: student._id,
      isActive: true,
    });
    if (fees) {
      await fees.updateOne({
        $set: {
          subjects: updated_subjects,
        },
      });
    }
    await student.save();

    res.status(201).json({
      message: 'Student has been modified',
      student,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};
module.exports.getStudentInvoices = async (req, res) => {
  const { student_id } = req.params;

  if (!student_id) return sendError(404, 'Student id required', res);

  try {
    const student = await Student.findById(student_id).populate(['invoices']);
    if (!student) return sendError(404, "Student doesn't exists", res);
    return res.status(200).json({
      invoices: student.invoices,
    });
  } catch (err) {
    console.log(err);
    sendError(500, 'Something went wrong', res);
  }
};
module.exports.changeStudentPassword = async (req, res) => {
  const { old_password, new_password, confirm_password } = req.body;

  try {
    const student = await Student.findById(req.user._id);

    if (!student) return sendError(404, "Student doesn't Exists", res);

    const isValidPassword = await student.validatePassword(old_password);

    if (!isValidPassword)
      return sendError(401, 'Old password is not correct', res);

    student.password = new_password;

    await student.save();
    res.status(204).end();
  } catch (err) {
    console.log(err);
    sendError(500, 'Something went wrong', res);
  }
};
module.exports.deleteStudent = async (req, res) => {
  const id = req.params.id;

  if (req.user.user_type !== 'admin')
    return sendError(401, 'Only Admins are allowed', res);

  const student = await Student.findById(id);

  if (!student) return sendError(404, "Student doesn't exists", res);

  try {
    await Subject.deleteMany({
      _id: {
        $in: student.subjects.map((id) => String(id)),
      },
    });

    await Fees.deleteMany({
      student: student._id,
    });

    await ClassActivity.deleteMany({
      student: student._id,
    });

    await TestReport.deleteMany({
      student: student._id,
    });

    await Student.findByIdAndDelete(id);

    res.status(201).json({
      message: 'Student has been deleted',
      student,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};
module.exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find({}, { password: 0 }).populate([
      'subjects',
      'test_reports',
      'class_activity',
      'active_invoice',
    ]);
    return res.status(200).json({
      students,
    });
  } catch (err) {
    console.log(err);
    sendError(500, 'Something went wrong', res);
  }
};
module.exports.exportStudentsToCSV = async (req, res) => {
  if (req.user.user_type !== 'admin')
    return sendError(401, 'Only Admins are allowed', res);

  try {
    const students = await Student.find({}, { password: 0 }).populate([
      'subjects',
    ]);

    if (!students) return sendError(404, 'No Students', res);

    const csv = json2csv(students);

    return res.status(200).json({
      exported: csv,
    });
  } catch (err) {
    console.log(err);
    sendError(500, 'Something went wrong', res);
  }
};
module.exports.getStudent = async (req, res) => {
  const id = req.params.id;
  try {
    const student = await Student.findById(id, { password: 0 }).populate([
      'subjects',
      'test_reports',
      'class_activity',
    ]);
    return res.status(200).json({
      student,
    });
  } catch (err) {
    console.log(err);
    sendError(500, 'Something went wrong', res);
  }
};
module.exports.studentIssueInvoice = async (req, res) => {
  if (req.user.user_type !== 'admin')
    return sendError(401, 'Only Admins are allowed', res);

  const { student_id, invoice_id } = req.body;

  if (!student_id || !invoice_id) {
    return sendError(400, "Required fields can't be empty", res);
  }

  const student = await Student.findById(student_id);

  if (!student) return sendError(404, 'Student not found', res);

  const invoice = await Fees.findById(invoice_id);

  if (!invoice) return sendError(404, "Invoice doesn't exists");

  try {
    invoice.issued = new Date();
    await invoice.save();
    dayjs.extend(isToday);
    if (
      invoice.isActive &&
      student.status === 'Active' &&
      dayjs(invoice.payment_reminder).isToday()
    ) {
      mailService({
        to: student.email,
        content: student.student_name,
        type: 'payment',
      })
        .then(() => {})
        .catch(() => {});
    }
    student.invoices.push(invoice_id);
    await student.save();
    res.status(201).json({
      message: 'success',
    });
  } catch (err) {
    console.log(err);
    sendError(500, 'Something went wrong', res);
  }
};
module.exports.getStudentReports = async (req, res) => {
  const { id } = req.params;
  try {
    const term_reports = await TestReport.find({
      student: id,
    }).populate(['student', 'subject', 'report_by']);
    const class_activity = await ClassActivity.find({
      student: id,
    }).populate(['student', 'subject', 'report_by']);

    res.status(200).json({
      term_reports,
      class_activity,
    });
  } catch (err) {
    console.log(err);
    sendError(500, 'Something went wrong', res);
  }
};

module.exports.assignTeacherToStudent = async (req, res) => {
  if (req.user.user_type !== 'admin')
    return sendError(401, 'Only Admins are allowed', res);

  const { teacherIds, studentId } = req.body;
  console.log(teacherIds, studentId);

  if (!studentId) {
    return sendError(400, 'Student id required', res);
  }

  const student = await Student.findById(studentId);

  if (!student) {
    return sendError(400, "Student doesn't exist", res);
  }
  try {
    student.assigned_teachers = teacherIds;
    await student.save();
    res.status(201).json({
      message: 'Success',
    });
  } catch (err) {
    console.log(err);
    sendError(500, 'Something went wrong', res);
  }
};

// Teacher Specific
module.exports.studentSingleTeacherReports = async (req, res) => {
  const { id } = req.params;

  try {
    const classActivity = await ClassActivity.find(
      {
        report_by: id,
      },
      {},
      {
        sort: {
          createdAt: -1,
        },
      }
    ).populate(['student', 'subject', 'report_by']);
    const test_reports = await TestReport.find(
      {
        report_by: id,
      },
      {},
      {
        sort: {
          createdAt: -1,
        },
      }
    ).populate(['student', 'subject', 'report_by']);

    res.status(200).json({
      classActivity,
      test_reports,
    });
  } catch (err) {
    console.log(err);
    sendError(500, 'Something went wrong', res);
  }
};

// Test Report
module.exports.createTestReport = async (req, res) => {
  if (req.user.user_type !== 'teacher')
    return sendError(401, 'You are not allowed', res);

  const {
    student_id,
    subject_id,
    date,
    comment,
    summary,
    progress,
    effort,
    attainment,
  } = req.body;

  if (!student_id || !subject_id || !date || !comment || !summary)
    return sendError(400, 'Please provide required fields', res);

  const test_report = new TestReport({
    student: student_id,
    subject: subject_id,
    date: date,
    comment: comment,
    summary: summary,
    report_by: req.user._id,
    progress: progress,
    effort: effort,
    attainment: attainment,
  });

  if (req.files.length > 0) {
    const files = req.files.map((file) => {
      return {
        filename: file.filename,
        originalname: file.originalname,
        url: `/uploads/${file.filename}`,
      };
    });
    test_report.feedback_files = files;
  }

  try {
    await test_report.save();

    res.status(201).json({
      test_report,
    });
  } catch (err) {
    console.log(err);
    sendError(500, 'Something went wrong', res);
  }
};
module.exports.getStudentTestReport = async (req, res) => {
  if (req.user.user_type !== 'teacher')
    return sendError(401, 'You are not allowed', res);

  const { reportid } = req.params;

  try {
    const report = await TestReport.findById(reportid);

    if (!report) {
      return sendError(404, "Report doesn't exists", res);
    }

    res.status(201).json({
      report,
    });
  } catch (err) {
    console.log(err);
    sendError(500, 'Something went wrong', res);
  }
};
module.exports.deleteStudentTestReport = async (req, res) => {
  if (req.user.user_type !== 'teacher')
    return sendError(401, 'You are not allowed', res);

  const { student_id } = req.body;
  const { reportid } = req.params;

  const student = await Student.findById(student_id);
  const test_reports = await TestReport.findById(reportid);

  if (!student) return sendError(404, "Student doesn't exists", res);
  if (!test_reports) return sendError(404, "Test Report doesn't exists", res);

  try {
    if (
      test_reports?.feedback_files &&
      test_reports.feedback_files.length > 0
    ) {
      test_reports.feedback_files.forEach(async (file) => {
        await fsPromise.unlink(path.join(__dirname, '..', file.url));
      });
    }

    student.test_reports = student.test_reports.filter((report) => {
      return report.toString() !== reportid;
    });

    await TestReport.findByIdAndDelete(reportid);
    await student.save();
    res.status(201).json({
      message: 'Test Report has been deleted',
    });
  } catch (err) {
    console.log(err);
    sendError(500, 'Something went wrong', res);
  }
};
module.exports.updateStudentTestReport = async (req, res) => {
  if (req.user.user_type !== 'teacher')
    return sendError(401, 'You are not allowed', res);
  const {
    date,
    comment,
    summary,
    removed_files,
    progress,
    effort,
    attainment,
  } = req.body;

  if (!date || !comment || !summary)
    return sendError(400, 'Please provide all fields', res);

  const { reportid } = req.params;
  const report = await TestReport.findById(reportid);
  if (!report) return sendError(404, "Report doesn't exists", res);

  try {
    if (removed_files) {
      let edited_feedback_files_list;
      JSON.parse(removed_files).forEach((removed_file) => {
        edited_feedback_files_list = report.feedback_files.map((file) => {
          if (String(file._id) === String(removed_file.uid)) {
            fs.unlinkSync(path.join(__dirname, '..', file.url));
            return null;
          } else {
            return file;
          }
        });
      });
      report.feedback_files = edited_feedback_files_list.filter(Boolean);
    }

    if (req.files.length > 0) {
      const files = req.files.map((file) => {
        return {
          filename: file.filename,
          originalname: file.originalname,
          url: `/uploads/${file.filename}`,
        };
      });
      report.feedback_files =
        [...report.feedback_files, ...files].length < 1
          ? null
          : [...report.feedback_files, ...files];
    }
    await report.save();
    await TestReport.findByIdAndUpdate(reportid, {
      $set: {
        date,
        comment,
        summary,
        progress,
        attainment,
        effort,
      },
    });

    res.status(201).json({
      message: 'Test Report has been updated',
    });
  } catch (err) {
    console.log(err);
    sendError(500, 'Something went wrong', res);
  }
};
module.exports.getStudentRecentTestReport = async (req, res) => {
  const { studentId } = req.params;

  try {
    const report = await TestReport.findOne(
      {
        student: studentId,
      },
      {},
      {
        sort: { createdAt: -1 },
      }
    ).populate('subject');

    res.status(201).json({
      report,
    });
  } catch (err) {
    console.log(err);
    sendError(500, 'Something went wrong', res);
  }
};
module.exports.getStudentSingleTestReport = async (req, res) => {
  const { id } = req.params;

  try {
    const report = await TestReport.findById(id).populate([
      'subject',
      'report_by',
    ]);

    res.status(201).json({
      report,
    });
  } catch (err) {
    console.log(err);
    sendError(500, 'Something went wrong', res);
  }
};
module.exports.getStudentAllTestReports = async (req, res) => {
  const { student_id } = req.params;

  try {
    const reports = await TestReport.find({
      student: student_id,
    }).populate('subject');

    res.status(201).json({
      reports,
    });
  } catch (err) {
    console.log(err);
    sendError(500, 'Something went wrong', res);
  }
};

// Class Activity
module.exports.createStudentClassActivity = async (req, res) => {
  if (req.user.user_type !== 'teacher')
    return sendError(401, 'You are not allowed', res);

  const { student_id, subject_id, date, comment, homework } = req.body;

  if (!student_id || !subject_id || !date || !comment || !homework)
    return sendError(400, 'Please provide required fields', res);

  const class_activity = new ClassActivity({
    student: student_id,
    subject: subject_id,
    date: date,
    comment: comment,
    homework: homework,
    report_by: req.user._id,
  });

  if (req.files.length > 0) {
    const files = req.files.map((file) => {
      return {
        filename: file.filename,
        originalname: file.originalname,
        url: `/uploads/${file.filename}`,
      };
    });
    class_activity.attachments = files;
  }

  try {
    await class_activity.save();

    res.status(201).json({
      class_activity,
    });
  } catch (err) {
    console.log(err);
    sendError(500, 'Something went wrong', res);
  }
};

module.exports.getStudentClassActivity = async (req, res) => {
  const { classActivityId } = req.params;

  try {
    const classActivity = await ClassActivity.findById(classActivityId);

    if (!classActivity) {
      return sendError(404, "Class Activity doesn't exists", res);
    }

    res.status(201).json({
      classActivity,
    });
  } catch (err) {
    console.log(err);
    sendError(500, 'Something went wrong', res);
  }
};

module.exports.deleteStudentClassActivity = async (req, res) => {
  if (req.user.user_type !== 'teacher')
    return sendError(401, 'You are not allowed', res);

  const { student_id } = req.body;
  const { classActivityId } = req.params;

  const student = await Student.findById(student_id);
  const classActivity = await ClassActivity.findById(classActivityId);

  if (!student) return sendError(404, "Student doesn't exists", res);
  if (!classActivity)
    return sendError(404, "Class Activity doesn't exists", res);

  try {
    if (classActivity?.attachments && classActivity.attachments.length > 0) {
      classActivity.attachments.forEach(async (file) => {
        await fsPromise.unlink(path.join(__dirname, '..', file.url));
      });
    }

    student.class_activity = student.class_activity.filter((report) => {
      return report.toString() !== classActivityId;
    });

    await ClassActivity.findByIdAndDelete(classActivityId);
    await student.save();
    res.status(201).json({
      message: 'Class Activity has been deleted',
    });
  } catch (err) {
    console.log(err);
    sendError(500, 'Something went wrong', res);
  }
};

module.exports.updateStudentClassActivity = async (req, res) => {
  if (req.user.user_type !== 'teacher')
    return sendError(401, 'You are not allowed', res);
  const { date, comment, homework, removed_files } = req.body;

  if (!date || !comment || !homework)
    return sendError(400, 'Please provide all fields', res);

  const { classActivityId } = req.params;
  const classActivity = await ClassActivity.findById(classActivityId);
  if (!classActivity)
    return sendError(404, "Class Activity doesn't exists", res);

  try {
    if (removed_files) {
      let edited_attachments_files_list;
      JSON.parse(removed_files).forEach((removed_file) => {
        edited_attachments_files_list = classActivity.attachments.map(
          (file) => {
            if (String(file._id) === String(removed_file.uid)) {
              fs.unlinkSync(path.join(__dirname, '..', file.url));
              return null;
            } else {
              return file;
            }
          }
        );
      });
      classActivity.attachments = edited_attachments_files_list.filter(Boolean);
    }

    if (req.files.length > 0) {
      const files = req.files.map((file) => {
        return {
          filename: file.filename,
          originalname: file.originalname,
          url: `/uploads/${file.filename}`,
        };
      });
      classActivity.attachments =
        [...classActivity.attachments, ...files].length < 1
          ? null
          : [...classActivity.attachments, ...files];
    }
    await classActivity.save();
    await ClassActivity.findByIdAndUpdate(classActivityId, {
      $set: {
        date,
        comment,
        homework,
      },
    });

    res.status(201).json({
      message: 'Class Activity has been updated',
    });
  } catch (err) {
    console.log(err);
    sendError(500, 'Something went wrong', res);
  }
};

module.exports.getStudentRecentClassActivity = async (req, res) => {
  const { studentId } = req.params;

  try {
    const classActivity = await ClassActivity.findOne(
      {
        student: studentId,
      },
      {},
      {
        sort: { createdAt: -1 },
      }
    ).populate('subject');

    res.status(201).json({
      classActivity,
    });
  } catch (err) {
    console.log(err);
    sendError(500, 'Something went wrong', res);
  }
};

module.exports.getStudentSingleClassActivity = async (req, res) => {
  const { id } = req.params;

  try {
    const classActivity = await ClassActivity.findById(id).populate([
      'subject',
      'report_by',
    ]);

    res.status(201).json({
      classActivity,
    });
  } catch (err) {
    console.log(err);
    sendError(500, 'Something went wrong', res);
  }
};

module.exports.getStudentAllClassActivity = async (req, res) => {
  const { student_id } = req.params;

  try {
    const classActivity = await ClassActivity.find({
      student: student_id,
    }).populate('subject');

    res.status(201).json({
      classActivity,
    });
  } catch (err) {
    console.log(err);
    sendError(500, 'Something went wrong', res);
  }
};
