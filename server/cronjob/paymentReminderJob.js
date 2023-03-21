const cron = require("node-cron");
const Student = require("../models/student.model");
const dayjs = require("dayjs");
const mailService = require("../utils/mailService");
const isToday = require("dayjs/plugin/isToday");

module.exports.initPaymentReminderJob = () => {
    const schedule = cron.schedule("0 0 0 * * *", async () => {
        const students = await Student.find({ status: "Active" }).populate(
            "active_invoice"
        );
        students.forEach((student) => {
            const payment_reminder = student.active_invoice.payment_reminder;
            dayjs.extend(isToday);
            const today = dayjs(payment_reminder).isToday();

            if (today && student.active_invoice.issued) {
                mailService({
                    to: student.email,
                    content: student.student_name,
                    type: "payment",
                })
                    .then(() => {})
                    .catch((err) => console.log("Cron Job Error: ", err));
            }
        });
    });

    schedule.start();
    console.log(
        "Cron Job has been started for payment reminder successfully !🚀"
    );
};
