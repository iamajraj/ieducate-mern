const mongoose = require("mongoose");

const FeesSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Student",
            required: true,
        },
        subjects: {
            type: [mongoose.SchemaTypes.ObjectId],
            ref: "Subject",
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
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Fees", FeesSchema);
