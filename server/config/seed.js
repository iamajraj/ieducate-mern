require("dotenv").config();
const Admin = require("../models/admin.model");
const connectDB = require("./db");

connectDB();

const adminInfo = {
    name: "Admin",
    username: "admin",
    email: "admin@gmail.com",
    password: "admin",
};

const createAdmin = async () => {
    const admin = new Admin({
        name: adminInfo.name,
        username: adminInfo.username,
        email: adminInfo.email,
        password: adminInfo.password,
    });
    await admin.save();
};

setTimeout(async () => {
    try {
        await createAdmin();
        console.log("admin created");
        process.exit(0);
    } catch (err) {
        console.log(err);
    }
}, 2000);
