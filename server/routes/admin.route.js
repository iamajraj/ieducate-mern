const express = require("express");
const {
    getAdmins,
    getAllUsers,
    exportToCSV,
    createAdmin,
    updateAdmin,
    getAdmin,
} = require("../controllers/admin.controller");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.get("/admins", verifyToken, getAdmins);
router.get("/get-all", verifyToken, getAllUsers);
router.get("/admins/export-to-csv", verifyToken, exportToCSV);
router.post("/admins", verifyToken, createAdmin);
router.put("/admins/:id", verifyToken, updateAdmin);
router.delete("/admins/:id", verifyToken, getAdmin);

module.exports = router;
