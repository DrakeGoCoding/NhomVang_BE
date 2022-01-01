const mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema({
    subject: String,
    content: {
        type: String,
        required: true
    },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdDate: { type: Date, default: Date.now, immutable: true }
});

const Newsletter = mongoose.model("Newsletter", newsletterSchema);
module.exports = Newsletter;
