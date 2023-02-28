require("dotenv").config();
const Admin = require("../models/admin.model");
const connectDB = require("./db");

connectDB();

const adminInfo = {
    name: "Akmal Raj",
    username: "raj123",
    email: "akmalraj07@gmail.com",
    password: "raj123",
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
