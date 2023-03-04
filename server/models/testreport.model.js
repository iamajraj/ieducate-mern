const mongoose = require("mongoose");

const TestReportSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Student",
        },
        subject: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Subject",
        },
        date: {
            type: Date,
            required: true,
        },
        feedback_files: {
            type: [String],
            default: [],
        },
        comment: {
            type: String,
            required: true,
        },
        summary: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("TestReport", TestReportSchema);
