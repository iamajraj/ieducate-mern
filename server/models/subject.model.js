const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema(
    {
        student_id: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Student",
        },
        subject_name: {
            type: String,
            required: true,
        },
        timetable: {
            type: String,
            required: true,
        },
        monthly_payment: {
            type: String,
            required: true,
        },
        first_lesson_date: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Subject = mongoose.model("Subject", SubjectSchema);

module.exports = {
    Subject,
    SubjectSchema,
};
