const mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema({
	sender: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
    subject: String,
    content: {
        type: String,
        required: true
    },
    createdDate: { type: Date, default: Date.now, immutable: true }
});

const Newsletter = mongoose.model("Newsletter", newsletterSchema);
module.exports = Newsletter;
