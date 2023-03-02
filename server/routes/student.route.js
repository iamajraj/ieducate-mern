const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const Student = require("../models/student.model");
const sendError = require("../utils/sendError");
const dayjs = require("dayjs");
const Subject = require("../models/subject.model");
const Fees = require("../models/fees.model");

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
    student.subjects.push(subject_ids);

    await Fees.create({
        subjects: subject_ids,
        student: student._id,
        due_date: dayjs(subjects[subjects.length - 1].first_lesson_date).add(
            30,
            "day"
        ),
        payment_reminder: dayjs(subjects[subjects.length - 1].first_lesson_date)
            .add(30, "day")
            .subtract(10, "day"),
        previous_due_date: dayjs(
            subjects[subjects.length - 1].first_lesson_date
        ).add(30, "day"),
    });

    try {
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

        if (password) {
            student.password = password;
        }

        // set the subject ids
        let allSubjectIds = [];
        subjects.forEach((sub) => {
            if (sub._id) {
                allSubjectIds.push(sub._id);
            }
        });

        // update fees
        const fees = await Fees.findOne({ student: student._id });
        fees.updateOne({
            $set: {
                subjects: allSubjectIds,
            },
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
                const fees = await Fees.findOne({
                    student: student._id,
                });
                fees.subjects.push(created_subjects.map((sub) => sub._id));
                // fees.previous_due_date = fees.due_date;
                // fees.due_date = dayjs(
                //     subjects[subjects.length - 1].first_lesson_date
                // ).add(30, "day");
                // fees.payment_reminder = dayjs(
                //     subjects[subjects.length - 1].first_lesson_date
                // )
                // .add(30, "day")
                // .subtract(10, "day");
                await fees.save();
                student.subjects.push(created_subjects.map((sub) => sub._id));
            }
        }

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
        const students = await Student.find({}, { password: 0 }).populate(
            "subjects"
        );
        return res.status(200).json({
            students,
        });
    } catch (err) {
        sendError(500, "Something went wrong", res);
    }
});

router.get("/students/:id", verifyToken, async (req, res) => {
    const id = req.params.id;
    try {
        const student = await Student.findById(id, { password: 0 }).populate(
            "subjects"
        );
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

module.exports = router;
