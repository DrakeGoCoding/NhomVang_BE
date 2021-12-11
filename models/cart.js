const mongoose = require("mongoose");

const itemSchema = mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    quantity: { type: Number }
});

const cartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: {
        type: [itemSchema],
        default: []
    },
    total: { type: Number, default: 0 }
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
