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
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("GeneralReport", GeneralReportSchema);
