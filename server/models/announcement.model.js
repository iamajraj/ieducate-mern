const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        created_by: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Admin",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Announcement", AnnouncementSchema);
