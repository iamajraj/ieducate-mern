const nodemailer = require("nodemailer");
const fs = require("fs").promises;
const path = require("path");

const mailService = async (to, from, content, type) => {
    const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const html =
        type === "payment"
            ? await getPaymentReminderHtml(content)
            : await getAnnouncementHtml(content);

    try {
        const res = await transport.sendMail({
            to,
            from,
            subject:
                type === "payment"
                    ? "Your Next Payment Reminder - ieducate"
                    : "New Announcement - ieducate",
            html,
        });

        // console.log(res);
    } catch (err) {
        console.log(err);
    }
};

const getAnnouncementHtml = async (announcement) => {
    const announcement_html_file = await fs.readFile(
        path.resolve(__dirname, "..", "static", "announcement.html"),
        {
            encoding: "utf-8",
        }
    );
    let announcement_html = announcement_html_file
        .replace("<%%%>", announcement.title)
        .replace("<%%%%>", announcement.description);

    return announcement_html;
};

const getPaymentReminderHtml = async (payment_date) => {
    const payment_reminder_html_file = await fs.readFile(
        path.resolve(__dirname, "..", "static", "payment_reminder.html"),
        {
            encoding: "utf-8",
        }
    );
    const payment_reminder_html = payment_reminder_html_file.replace(
        "<%%%%>",
        payment_date
    );

    console.log(payment_reminder_html);

    return payment_reminder_html;
};

module.exports = mailService;
