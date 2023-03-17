const verifyToken = require("../middlewares/verifyToken");
const Teacher = require("../models/teacher.model");
const sendError = require("../utils/sendError");
const json2csv = require("json2csv").parse;

module.exports.createTeacher = async (req, res) => {
    if (req.user.user_type !== "admin")
        return sendError(401, "Only Admins are allowed", res);

    const { email, username, name, password, speciality } = req.body;

    if (!email || !username || !name || !password)
        return sendError(400, "Required fields can't be empty", res);

    const isEmailExists = await Teacher.findOne({ email });

    if (isEmailExists) sendError(400, "Email is already exists", res);

    // create teacher
    const teacher = new Teacher({
        name,
        username,
        email: String(email).toLowerCase(),
        password,
        speciality,
    });

    try {
        // save the teacher
        await teacher.save();

        return res.status(201).json({
            message: "Teacher has been created",
            teacher: teacher, // <- created teacher
        });
    } catch (err) {
        console.log(err);
        return sendError(500, "Something went wrong.", res);
    }
};
module.exports.getTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find({}, { password: 0 });
        res.status(200).json({
            teachers,
        });
    } catch (err) {
        sendError(500, "Something went wrong", res);
    }
};
module.exports.getSingleTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id, { password: 0 });
        res.status(200).json({
            teacher,
        });
    } catch (err) {
        sendError(500, "Something went wrong", res);
    }
};
module.exports.updateTeacher = async (req, res) => {
    const { name, username, email, speciality, _id: id, password } = req.body;
    if (req.user.user_type !== "admin")
        return sendError(401, "Only Admins are allowed", res);

    if (!name || !username || !email)
        return sendError(400, "All fields are required!", res);

    const user = await Teacher.findById(id);

    if (email != user.email) {
        const isEmailExists = await Teacher.find({
            email,
        });

        if (isEmailExists.length > 0)
            return sendError(400, "Email already exists", res);
    }

    if (password && password.trim() !== "") {
        user.password = password;
    }

    try {
        await Teacher.findByIdAndUpdate(id, {
            $set: {
                name: name,
                username: username,
                email: email,
                speciality: speciality,
            },
        });
        await user.save();
        res.status(201).json({
            message: "Teacher has been modified",
        });
    } catch (err) {
        res.status(500).json({
            message: "Something went wrong",
        });
    }
};
module.exports.deleteTeacher = async (req, res) => {
    if (req.user.user_type !== "admin")
        return sendError(401, "Only Admins allowed", res);

    const user = await Teacher.findById(req.params.id);

    if (!user) return sendError(404, "Teacher doesn't exists", res);

    try {
        await Teacher.findByIdAndDelete(req.params.id);
        res.status(201).json({
            message: "Teacher has been deleted",
        });
    } catch (err) {
        res.status(500).json({
            message: "Something went wrong",
        });
    }
};
module.exports.updateTeacherCredentials = async (req, res) => {
    const { email, password } = req.body;

    if (req.user.user_type !== "teacher")
        return sendError(401, "Only Teacher are allowed", res);

    if (!email && !password)
        return sendError(400, "Both field can't be empty!", res);

    const id = req.user._id;

    const teacher = await Teacher.findById(id);

    if (email) {
        if (email != teacher.email) {
            const isEmailExists = await Teacher.find({
                email,
            });

            if (isEmailExists.length > 0) {
                return sendError(400, "Email already exists", res);
            } else {
                teacher.email = email;
            }
        }
    }

    if (password) {
        teacher.password = password;
    }

    try {
        await teacher.save();
        res.status(201).json({
            message: "Credentials has been updated !",
            user: {
                id: teacher._id,
                username: teacher.username,
                email: teacher.email,
                name: teacher.name,
                user_type: teacher.user_type,
            },
        });
    } catch (err) {
        res.status(500).json({
            message: "Something went wrong",
        });
    }
};

module.exports.exportTeachersToCSV = async (req, res) => {
    if (req.user.user_type !== "admin")
        return sendError(401, "Only Admins are allowed", res);

    try {
        const teachers = await Teacher.find({}, { password: 0 });

        const csv = json2csv(teachers);

        return res.status(200).json({
            exported: csv,
        });
    } catch (err) {
        sendError(500, "Something went wrong", res);
    }
};
module.exports.setTeacherAttendance = async (req, res) => {
    if (req.user.user_type !== "admin")
        return sendError(401, "Only Admins are allowed", res);

    const { date, fromTime, toTime, teacher_id, total_hour } = req.body;

    if (!date || !fromTime || !toTime || !teacher_id || !total_hour)
        return sendError(400, "Required fields can't be empty", res);

    const teacher = await Teacher.findById(teacher_id);

    if (!teacher) sendError(400, "Teacher doesn't exists", res);

    teacher.attendance.push({
        attendanceBy: req.user._id,
        date: date,
        fromTime: fromTime,
        toTime: toTime,
        total_hour: total_hour,
    });

    try {
        // save the teacher
        await teacher.save();

        return res.status(201).json({
            message: "Teacher attendance has been added",
            teacher: teacher, // <- created teacher
        });
    } catch (err) {
        console.log(err);
        return sendError(500, "Something went wrong.", res);
    }
};
module.exports.deleteTeacherAttendance = async (req, res) => {
    if (req.user.user_type !== "admin")
        return sendError(401, "Only Admins are allowed", res);

    const { attendance_id, teacher_id } = req.body;

    const teacher = await Teacher.findById(teacher_id);

    if (!teacher) return sendError(404, "Teacher doesn't Exists", res);

    teacher.attendance = teacher.attendance.filter((att) => {
        return att._id.toString() !== String(attendance_id);
    });

    try {
        await teacher.save();
        return res.status(201).json({
            message: "Teacher attendance has been deleted",
        });
    } catch (err) {
        console.log(err);
        return sendError(500, "Something went wrong.", res);
    }
};
