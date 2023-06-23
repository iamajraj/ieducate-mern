const mongoose = require('mongoose');

const Attachment = new mongoose.Schema({
  filename: String,
  originalname: String,
  url: String,
});

const ClassActivitySchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Student',
    },
    subject: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Subject',
    },
    date: {
      type: Date,
      required: true,
    },
    attachments: {
      type: [Attachment],
      default: [],
    },
    homework: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    report_by: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Teacher',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ClassActivity', ClassActivitySchema);
