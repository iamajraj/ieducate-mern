const mongoose = require("mongoose");

const GeneralReportSchema = new mongoose.Schema(
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
        progress: {
            type: String,
            required: true,
        },
        attainment: {
            type: String,
            required: true,
        },
        effort: {
            type: String,
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
        report_by: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Teacher",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("GeneralReport", GeneralReportSchema);
