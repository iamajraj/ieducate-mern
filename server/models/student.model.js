const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
      type: [mongoose.SchemaTypes.ObjectId],
      ref: 'Fees',
      default: [],
    },
    number_of_subject: {
      type: Number,
      default: 0,
    },
    subjects: {
      type: [mongoose.SchemaTypes.ObjectId],
      ref: 'Subject',
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
    class_activity: {
      type: [mongoose.SchemaTypes.ObjectId],
      default: [],
      ref: 'ClassActivity',
    },
    test_reports: {
      type: [mongoose.SchemaTypes.ObjectId],
      default: [],
      ref: 'TestReport',
    },
    status: {
      type: String,
      enum: ['Active', 'Suspended', 'Left'],
      default: 'Active',
    },
    password: {
      type: String,
      required: true,
    },
    user_type: {
      type: String,
      default: 'student',
    },
    last_payment_date: {
      type: Date,
      default: null,
    },
    active_invoice: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Fees',
      default: null,
    },
    assigned_teachers: {
      type: [mongoose.SchemaTypes.ObjectId],
      ref: 'Teacher',
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

StudentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
});

StudentSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Student', StudentSchema);
