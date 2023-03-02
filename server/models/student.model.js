const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const SubSubjectSchema = new mongoose.Schema({
    subject_name: {
        type: String,
        required: true,
    },
    last_payment_date: {
        type: Date,
        default: null,
    },
    monthly_payment: {
        type: Number,
        required: true,
    },
});

const InvoiceSchema = new mongoose.Schema({
    student_name: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    number_of_subject: {
        type: Number,
        required: true,
    },
    subjects: {
        type: [SubSubjectSchema],
        required: true,
    },
    total_amount: {
        type: Number,
        required: true,
    },
    due_date: {
        type: Date,
        required: true,
    },
});

const StudentSchema = new mongoose.Schema(
    {
        student_roll_no: {
            type: Number,
            required: true,
        },
        student_name: {
            type: String,
            required: true,
        },
        student_address: {
            type: String,
            required: true,
        },
        student_telephone: {
            type: Number,
            required: true,
        },
        emergency_name: {
            type: String,
            required: true,
        },
        emergency_contact_number: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        learning_support_needs: {
            type: String,
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
        invoices: {
            type: [InvoiceSchema],
            default: [],
        },
        number_of_subject: {
            type: Number,
            default: 0,
        },
        subjects: {
            type: [mongoose.SchemaTypes.ObjectId],
            ref: "Subject",
            default: [],
        },
        registration_date: {
            type: Date,
            default: Date.now(),
        },
        registration_amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["Active", "Suspended", "Left"],
            default: "Active",
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

StudentSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
});

StudentSchema.methods.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Student", StudentSchema);
