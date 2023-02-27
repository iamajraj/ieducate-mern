require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// connect to db
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API SETUP
app.get("/", (req, res) => {
    res.status(200).json({
        api: "iEDUCATE API V1",
        date: "26 Feb 2022",
    });
});

const PORT = process.env.PORT || 5000;

// start the server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT} 🍕`);
});
