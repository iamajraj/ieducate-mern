const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const sendError = require("../utils/sendError");
const dayjs = require("dayjs");
const Fees = require("../models/fees.model");
const json2csv = require("json2csv").parse;
const fsPromise = require("fs").promises;
const fs = require("fs");
const path = require("path");

const Student = require("../models/student.model");
const { Subject } = require("../models/subject.model");
const GeneralReport = require("../models/generalreport.model");
const TestReport = require("../models/testreport.model");
const upload = require("../utils/upload");
const mailService = require("../utils/mailService");

const router = express.Router();

router.post("/students", verifyToken, async (req, res) => {
    if (req.user.user_type !== "admin")
        return sendError(401, "Only Admins are allowed", res);

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

    if (isEmailExists) return sendError(400, "Email already exists", res);

    const student = new Student({
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
        30,
        "day"
    );

    const payment_reminder_date = dayjs(
        subjects[subjects.length - 1].first_lesson_date
    )
        .add(30, "day")
        .subtract(10, "day");

    const fees = await Fees.create({
        subjects: created_subjects,
        student: student._id,
        due_date: due_date,
        payment_reminder: payment_reminder_date,
        previous_due_date: dayjs(
            subjects[subjects.length - 1].first_lesson_date
        ).add(30, "day"),
        isActive: true,
    });

    // mailService(
    //     email,
    //     "support@ieducate.com",
    //     due_date.format("DD/MM/YYYY"),
    //     "payment"
    // )
    //     .then(() => {})
    //     .catch(() => {});

    try {
        student.active_invoice = fees._id;
        await student.save();

        res.status(201).json({
            message: "Student has been created",
            student,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Something went wrong",
        });
    }
});

router.put("/students/:id", verifyToken, async (req, res) => {
    const id = req.params.id;

    if (req.user.user_type !== "admin")
        return sendError(401, "Only Admins are allowed", res);

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

    if (!student) return sendError(404, "Student ID is invalid", res);

    if (student.email !== email) {
        const isEmailExists = await Student.findOne({ email });
        if (isEmailExists) return sendError(400, "Email already exists", res);
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

        if (password && password.trim() !== "") {
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
                        due_date: dayjs().add(30, "day"),
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
        await fees.updateOne({
            $set: {
                subjects: updated_subjects,
            },
        });
        await student.save();

        res.status(201).json({
            message: "Student has been modified",
            student,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Something went wrong",
        });
    }
});

router.delete("/students/:id", verifyToken, async (req, res) => {
    const id = req.params.id;

    if (req.user.user_type !== "admin")
        return sendError(401, "Only Admins are allowed", res);

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

        await Student.findByIdAndDelete(id);

        res.status(201).json({
            message: "Student has been deleted",
            student,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Something went wrong",
        });
    }
});

router.get("/students", verifyToken, async (req, res) => {
    try {
        const students = await Student.find({}, { password: 0 }).populate([
            "subjects",
            "general_reports",
            "test_reports",
            "active_invoice",
        ]);
        return res.status(200).json({
            students,
        });
    } catch (err) {
        console.log(err);
        sendError(500, "Something went wrong", res);
    }
});

router.get("/students/export-to-csv", verifyToken, async (req, res) => {
    if (req.user.user_type !== "admin")
        return sendError(401, "Only Admins are allowed", res);

    try {
        const students = await Student.find({}, { password: 0 }).populate([
            "subjects",
        ]);

        if (!students) return sendError(404, "No Students", res);

        const csv = json2csv(students);

        return res.status(200).json({
            exported: csv,
        });
    } catch (err) {
        console.log(err);
        sendError(500, "Something went wrong", res);
    }
});

router.get("/students/:id", verifyToken, async (req, res) => {
    const id = req.params.id;
    try {
        const student = await Student.findById(id, { password: 0 }).populate([
            "subjects",
            "general_reports",
            "test_reports",
        ]);
        return res.status(200).json({
            student,
        });
    } catch (err) {
        sendError(500, "Something went wrong", res);
    }
});

router.post("/students/issue-invoice", verifyToken, async (req, res) => {
    if (req.user.user_type !== "admin")
        return sendError(401, "Only Admins are allowed", res);

    const {
        student_id,
        student_name,
        year,
        number_of_subject,
        subjects,
        total_amount,
        due_date,
    } = req.body;

    if (
        (!student_id,
        !student_name ||
            !year ||
            !number_of_subject ||
            !subjects ||
            !total_amount ||
            !due_date)
    ) {
        return sendError(400, "Required fields can't be empty", res);
    }

    const student = await Student.findById(student_id);

    if (!student) return sendError(404, "Student not found", res);

    try {
        student.invoices.push({
            student_name,
            year,
            number_of_subject,
            total_amount,
            due_date,
            subjects,
        });
        await student.save();
        res.status(201).json({
            message: "success",
        });
    } catch (err) {
        sendError(500, "Something went wrong", res);
    }
});

router.get("/students/:id/reports", verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const general_reports = await GeneralReport.find({
            student: id,
        }).populate(["student", "subject", "report_by"]);
        const test_reports = await TestReport.find({
            student: id,
        }).populate(["student", "subject", "report_by"]);

        res.status(200).json({
            general_reports,
            test_reports,
        });
    } catch (err) {
        console.log(err);
        sendError(500, "Something went wrong", res);
    }
});

// teacher specific reports
router.get(
    "/students/single-teacher-reports/:id",
    verifyToken,
    async (req, res) => {
        const { id } = req.params;
        try {
            const general_reports = await GeneralReport.find(
                {
                    report_by: id,
                },
                {},
                {
                    sort: {
                        created_at: -1,
                    },
                }
            ).populate(["student", "subject", "report_by"]);
            const test_reports = await TestReport.find(
                {
                    report_by: id,
                },
                {},
                {
                    sort: {
                        created_at: -1,
                    },
                }
            ).populate(["student", "subject", "report_by"]);

            res.status(200).json({
                general_reports,
                test_reports,
            });
        } catch (err) {
            console.log(err);
            sendError(500, "Something went wrong", res);
        }
    }
);

// GENERAL REPORT
router.post("/students/general-report", verifyToken, async (req, res) => {
    if (req.user.user_type !== "teacher")
        return sendError(401, "You are not allowed", res);
    const {
        student_id,
        subject_id,
        date,
        progress,
        attainment,
        effort,
        comment,
    } = req.body;

    if (
        !student_id ||
        !subject_id ||
        !date ||
        !progress ||
        !attainment ||
        !effort ||
        !comment
    )
        return sendError(400, "Please provide all fields", res);

    const student = await Student.findById(student_id);

    if (!student) return res.sendError(404, "Student doesn't exists", res);

    try {
        const created_report = new GeneralReport({
            student: student_id,
            subject: subject_id,
            date,
            progress,
            attainment,
            effort,
            comment,
            report_by: req.user._id,
        });

        await created_report.save();

        student.general_reports.push(created_report._id);

        await student.save();

        res.status(201).json({
            message: "General Report has been created",
        });
    } catch (err) {
        console.log(err);
        sendError(500, "Something went wrong", res);
    }
});

router.get(
    "/students/general-report/:reportid",
    verifyToken,
    async (req, res) => {
        if (req.user.user_type !== "teacher")
            return sendError(401, "You are not allowed", res);

        const { reportid } = req.params;

        try {
            const report = await GeneralReport.findById(reportid);

            if (!report) {
                return sendError(404, "Report doesn't exists", res);
            }

            res.status(201).json({
                report,
            });
        } catch (err) {
            console.log(err);
            sendError(500, "Something went wrong", res);
        }
    }
);
router.delete(
    "/students/general-report/:reportid",
    verifyToken,
    async (req, res) => {
        if (req.user.user_type !== "teacher")
            return sendError(401, "You are not allowed", res);

        const { student_id } = req.body;
        const { reportid } = req.params;

        const student = await Student.findById(student_id);

        if (!student) return sendError(404, "Student doesn't exists", res);

        student.general_reports = student.general_reports.filter((report) => {
            return report.toString() !== reportid;
        });

        try {
            await GeneralReport.findByIdAndDelete(reportid);
            await student.save();
            res.status(201).json({
                message: "General Report has been deleted",
            });
        } catch (err) {
            sendError(500, "Something went wrong", res);
        }
    }
);
router.put(
    "/students/general-report/:reportid",
    verifyToken,
    async (req, res) => {
        if (req.user.user_type !== "teacher")
            return sendError(401, "You are not allowed", res);
        const { date, progress, attainment, effort, comment } = req.body;

        if (!date || !progress || !attainment || !effort || !comment)
            return sendError(400, "Please provide all fields", res);

        const { reportid } = req.params;

        const report = await GeneralReport.findById(reportid);

        if (!report) return sendError(404, "Report doesn't exists", res);

        try {
            await GeneralReport.findByIdAndUpdate(reportid, {
                $set: {
                    date,
                    progress,
                    attainment,
                    effort,
                    comment,
                },
            });

            res.status(201).json({
                message: "General Report has been updated",
            });
        } catch (err) {
            console.log(err);
            sendError(500, "Something went wrong", res);
        }
    }
);

// TEST REPORT
router.post(
    "/students/test-report",
    verifyToken,
    upload.array("feedback_files[]"),
    async (req, res) => {
        if (req.user.user_type !== "teacher")
            return sendError(401, "You are not allowed", res);

        const { student_id, subject_id, date, comment, summary } = req.body;

        if (!student_id || !subject_id || !date || !comment || !summary)
            return sendError(400, "Please provide required fields", res);

        const test_report = new TestReport({
            student: student_id,
            subject: subject_id,
            date: date,
            comment: comment,
            summary: summary,
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
            test_report.feedback_files = files;
        }

        try {
            await test_report.save();

            res.status(201).json({
                test_report,
            });
        } catch (err) {
            sendError(500, "Something went wrong", res);
        }
    }
);
router.get("/students/test-report/:reportid", verifyToken, async (req, res) => {
    if (req.user.user_type !== "teacher")
        return sendError(401, "You are not allowed", res);

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
        sendError(500, "Something went wrong", res);
    }
});
router.delete(
    "/students/test-report/:reportid",
    verifyToken,
    async (req, res) => {
        if (req.user.user_type !== "teacher")
            return sendError(401, "You are not allowed", res);

        const { student_id } = req.body;
        const { reportid } = req.params;

        const student = await Student.findById(student_id);
        const test_reports = await TestReport.findById(reportid);

        if (!student) return sendError(404, "Student doesn't exists", res);
        if (!test_reports)
            return sendError(404, "Test Report doesn't exists", res);

        try {
            if (
                test_reports?.feedback_files &&
                test_reports.feedback_files.length > 0
            ) {
                test_reports.feedback_files.forEach(async (file) => {
                    await fsPromise.unlink(
                        path.join(__dirname, "..", file.url)
                    );
                });
            }

            student.test_reports = student.test_reports.filter((report) => {
                return report.toString() !== reportid;
            });

            await TestReport.findByIdAndDelete(reportid);
            await student.save();
            res.status(201).json({
                message: "Test Report has been deleted",
            });
        } catch (err) {
            console.log(err);
            sendError(500, "Something went wrong", res);
        }
    }
);
router.put(
    "/students/test-report/:reportid",
    upload.array("feedback_files[]"),
    verifyToken,
    async (req, res) => {
        if (req.user.user_type !== "teacher")
            return sendError(401, "You are not allowed", res);
        const { date, comment, summary, removed_files } = req.body;

        if (!date || !comment || !summary)
            return sendError(400, "Please provide all fields", res);

        const { reportid } = req.params;
        const report = await TestReport.findById(reportid);
        if (!report) return sendError(404, "Report doesn't exists", res);

        try {
            if (removed_files) {
                let edited_feedback_files_list;
                JSON.parse(removed_files).forEach((removed_file) => {
                    edited_feedback_files_list = report.feedback_files.map(
                        (file) => {
                            if (String(file._id) === String(removed_file.uid)) {
                                fs.unlinkSync(
                                    path.join(__dirname, "..", file.url)
                                );
                                return null;
                            } else {
                                return file;
                            }
                        }
                    );
                });
                report.feedback_files =
                    edited_feedback_files_list.filter(Boolean);
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
                },
            });

            res.status(201).json({
                message: "General Report has been updated",
            });
        } catch (err) {
            console.log(err);
            sendError(500, "Something went wrong", res);
        }
    }
);

module.exports = router;
