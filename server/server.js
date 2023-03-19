require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoute = require("./routes/auth.route");
const adminRoute = require("./routes/admin.route");
const announcementRoute = require("./routes/announcement.route");
const teacherRoute = require("./routes/teacher.route");
const studentRoute = require("./routes/student.route");
const feesRoute = require("./routes/fees.route");
const morgan = require("morgan");
const { initPaymentReminderJob } = require("./cronjob/paymentReminderJob");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("short"));
app.use("/uploads", express.static(__dirname + "/uploads"));

initPaymentReminderJob();

// API SETUP
app.get("/api", (req, res) => {
    res.status(200).json({
        api: "iEDUCATE API V1",
        date: "26 Feb 2022",
    });
});

// auth route
app.use("/api/auth", authRoute);

// admin route
app.use("/api", adminRoute);

// announcements
app.use("/api", announcementRoute);

// teacher
app.use("/api", teacherRoute);

// student
app.use("/api", studentRoute);

// fees
app.use("/api", feesRoute);

const PORT = process.env.PORT || 5000;

// start the server
connectDB()
    .then(() => {
        app.listen(PORT, async () => {
            console.log(`Server started on port ${PORT} 🍕`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
