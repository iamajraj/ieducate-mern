const multer = require("multer");
const path = require("path");
const fs = require("fs");

const PATH = path.resolve(__dirname, "..", "uploads");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync(PATH)) {
            fs.mkdirSync(PATH);
        }
        cb(null, PATH);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});

const upload = multer({ storage });

module.exports = upload;
