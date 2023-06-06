const sendError = require('../utils/sendError');
const Admin = require('../models/admin.model');
const Student = require('../models/student.model');
const Teacher = require('../models/teacher.model');
const { jwtSign } = require('../utils/jwtService');

module.exports.loginAdmin = async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password)
    return sendError(400, 'All fields are required', res);

  const admin = await Admin.findOne({
    email: {
      $regex: email,
      $options: 'i',
    },
  });

  if (!admin) return sendError(404, "Account doesn't exist.", res);

  const isValidPassword = await admin.validatePassword(password);

  if (!isValidPassword)
    return sendError(400, 'Email or Password is invalid', res);

  const token = jwtSign(admin.toJSON());

  res.status(200).json({
    token,
    user: {
      id: admin._id,
      username: admin.username,
      email: admin.email,
      name: admin.name,
      user_type: admin.user_type,
    },
  });
};
module.exports.loginTeacher = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return sendError(400, 'All fields are required', res);

  const teacher = await Teacher.findOne({
    email: {
      $regex: email,
      $options: 'i',
    },
  });

  if (!teacher) return sendError(404, "Account doesn't exist.", res);

  const isValidPassword = await teacher.validatePassword(password);

  if (!isValidPassword)
    return sendError(400, 'Email or Password is invalid', res);

  const token = jwtSign({
    user_type: teacher.user_type,
    _id: teacher._id,
  });

  res.status(200).json({
    token,
    user: {
      id: teacher._id,
      username: teacher.username,
      email: teacher.email,
      name: teacher.name,
      user_type: teacher.user_type,
    },
  });
};
module.exports.loginStudent = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return sendError(400, 'All fields are required', res);

  const student = await Student.findOne({
    email: {
      $regex: email,
      $options: 'i',
    },
  });

  if (!student) return sendError(404, "Account doesn't exist.", res);

  const isValidPassword = await student.validatePassword(password);

  if (!isValidPassword)
    return sendError(400, 'Email or Password is invalid', res);

  // if (student.status === "Suspended") {
  //     return sendError(400, "The student has been suspended", res);
  // } else
  if (student.status === 'Left') {
    return sendError(400, 'The student has been left', res);
  }

  const token = jwtSign({
    user_type: student.user_type,
    _id: student._id,
  });

  res.status(200).json({
    token,
    user: {
      id: student._id,
      email: student.email,
      name: student.student_name,
      user_type: student.user_type,
    },
  });
};
