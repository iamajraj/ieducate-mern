const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const {
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    getAnnouncements,
} = require("../controllers/announcement.controller");

const router = express.Router();

router.post("/announcements", verifyToken, createAnnouncement);
router.put("/announcements/:id", verifyToken, updateAnnouncement);
router.delete("/announcements/:id", verifyToken, deleteAnnouncement);
router.get("/announcements", verifyToken, getAnnouncements);

module.exports = router;
