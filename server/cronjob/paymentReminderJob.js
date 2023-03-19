const cron = require("node-cron");
const Student = require("../models/student.model");
const dayjs = require("dayjs");
const mailService = require("../utils/mailService");

module.exports.initPaymentReminderJob = () => {
    const schedule = cron.schedule("0 0 0 * * *", async () => {
        const students = await Student.find({ status: "Active" }).populate(
            "active_invoice"
        );
        students.forEach((student) => {
            const payment_reminder = student.active_invoice.payment_reminder;
            const isToday = dayjs(payment_reminder).isSame(new Date(), "day");

            if (isToday) {
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
