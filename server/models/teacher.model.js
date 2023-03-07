const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const TeacherAttendanceSchema = new mongoose.Schema(
    {
        fromTime: Date,
        toTime: Date,
        date: Date,
        total_hour: Number,
        attendanceBy: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Admin",
        },
    },
    {
        timestamps: true,
    }
);

const TeachersSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        username: {
            type: String,
            required: true,
        },
        speciality: {
            type: String,
            default: null,
        },
        attendance: {
            type: [TeacherAttendanceSchema],
            default: [],
        },
        password: {
            type: String,
            required: true,
        },
        user_type: {
            type: String,
            default: "teacher",
        },
    },
    {
        timestamps: true,
    }
);

TeachersSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
});

TeachersSchema.methods.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Teacher", TeachersSchema);
