const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    action: {
        type: String,
        required: true
    },
    target: {
        type: String,
        enum: ["user", "admin"],
        default: "admin"
    },
    link: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    viewedBy: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        default: []
    }
});

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
