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
                    ref: "Product"
                },
                quantity: Number
            }
        ],
        required: true
    },
    total: Number,
    discountTotal: Number,
    paymentMethod: {
        type: String,
        enum: ["COD", "PayPal", "Stripe"],
        default: "COD"
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "done"],
        default: "pending"
    },
    status: {
        type: String,
        enum: ["pending", "in_progress", "delivered", "failed"],
        default: "pending"
    },
    createdAt: { type: Date, default: Date.now, immutable: true },
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
				message: String,
                nextStatus: String,
                time: { type: Date, default: Date.now, immutable: true }
            }
        ]
    }
});

const Invoice = mongoose.model("Invoice", invoiceSchema);
module.exports = Invoice;
