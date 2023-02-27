const mongoose = require("mongoose");

const connectDB = () => {
    try {
        mongoose.set("strictQuery", false);
        mongoose.connect(process.env.MONGO_URI);
        console.log("Database Connected 🍕");
    } catch (err) {
        console.log("Failed to connect to database 👎");
        process.exit(1);
    }
};

module.exports = connectDB;
