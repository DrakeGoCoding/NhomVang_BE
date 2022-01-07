const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        immutable: true
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
								slug: String,
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
                },
                vouchers: {
                    type: [String],
                    default: []
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
        enum: ["pending", "done", "cancel"],
        default: "pending"
    },
    paymentId: { type: String },
    status: {
        type: String,
        enum: ["pending", "in_progress", "delivered", "failed"],
        default: "pending"
    },
    createdDate: { type: Date, default: Date.now, immutable: true },
    modifiedDate: { type: Date, default: Date.now },
    logs: {
        type: [
            {
                _id: false,
                user: {
                    type: String,
                    required: true
                },
                action: {
                    type: String,
                    enum: ["create", "change_status", "cancel"]
                },
                nextStatus: String,
                prevStatus: String,
                timestamp: { type: Date, default: Date.now, immutable: true }
            }
        ]
    }
});

invoiceSchema.pre(
    ["save", "update", "updateOne", "updateMany", "findOneAndUpdate", "findByIdAndUpdate"],
    async function (next) {
        this.modifiedDate = Date.now();
        next();
    }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);
module.exports = Invoice;
