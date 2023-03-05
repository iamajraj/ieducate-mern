const mongoose = require("mongoose");
const { SubjectSchema } = require("./subject.model");

const FeesSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Student",
            required: true,
        },
        subjects: {
            type: [SubjectSchema],
            required: true,
            default: [],
        },
        previous_due_date: {
            type: Date,
            default: null,
        },
        due_date: {
            type: Date,
            default: null,
        },
        payment_reminder: {
            type: Date,
            default: null,
        },
        isPaid: {
            type: String,
            enum: ["Paid", "Not Paid"],
            default: "Not Paid",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Fees", FeesSchema);
