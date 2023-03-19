const mailService = require("../utils/mailService");

process.on("message", async ({ students, announcement }) => {
    await sendAnnouncementMail(students, announcement);
});

const sendAnnouncementMail = async (students, announcement) => {
    students.forEach(async (student) => {
        await mailService({
            to: student.email,
            content: announcement,
            type: "announcement",
        });
    });
};
