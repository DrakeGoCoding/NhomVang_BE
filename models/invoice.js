const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: {
        type: [
            {
                _id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                name: {
                    type: String,
                    required: true
                },
				thumbnail: String,
                listedPrice: {
                    type: Number,
                    required: true
                },
                discountPrice: {
                    type: Number,
                    default: 0
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ],
        required: true
    },
    total: Number,
    discountTotal: Number,
    paymentMethod: {
        type: String,
        enum: ["paypal", "stripe"]
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "done"],
        default: "pending"
    },
    paymentId: { type: String },
    status: {
        type: String,
        enum: ["pending", "in_progress", "delivered", "failed"],
        default: "pending"
    },
    createdDate: { type: Date, default: Date.now, immutable: true },
    logs: {
        type: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },
                action: {
                    type: String,
                    enum: ["change_status", "cancel"]
                },
                nextStatus: String,
                timestamp: { type: Date, default: Date.now, immutable: true }
            }
        ]
    },
    vouchers: [String]
});

const Invoice = mongoose.model("Invoice", invoiceSchema);
module.exports = Invoice;
