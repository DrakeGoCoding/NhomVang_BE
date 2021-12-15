const mongoose = require("mongoose");
const { responseCart } = require("@utils/responsor");

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: {
        type: [
            {
                _id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                quantity: { type: Number, required: true }
            }
        ],
        default: []
    }
});

cartSchema.methods.addItem = async function (product, quantity = 1) {
    const updatedItems = [...this.items];
    const itemIndex = updatedItems.findIndex(item => {
        return product._id.toString() === item._id.toString();
    });

    if (itemIndex < 0) {
        updatedItems.push({ _id: product._id, quantity });
    } else {
        updatedItems[itemIndex].quantity += quantity;
    }

    this.items = updatedItems;
    let updatedCart = await this.save();
    updatedCart = await this.populate({
        path: "items._id",
        select: "name supplier slug thumbnail listedPrice discountPrice inStock"
    });
    return { cart: responseCart(updatedCart.toJSON()) };
};

cartSchema.methods.removeItem = async function (itemId) {
    const updatedItems = this.items.filter(item => {
        return itemId !== item._id.toString();
    });

    this.items = updatedItems;
    let updatedCart = await this.save();
    updatedCart = await this.populate({
        path: "items._id",
        select: "name supplier slug thumbnail listedPrice discountPrice inStock"
    });
    return { cart: responseCart(updatedCart.toJSON()) };
};

cartSchema.methods.updateItem = async function (itemId, quantity) {
    const updatedItems = [...this.items];
    const itemIndex = updatedItems.findIndex(item => {
        return itemId === item._id.toString();
    });

    if (itemIndex >= 0) {
        updatedItems[itemIndex].quantity = quantity;
    }

    this.items = updatedItems;
    let updatedCart = await this.save();
    updatedCart = await this.populate({
        path: "items._id",
        select: "name supplier slug thumbnail listedPrice discountPrice inStock"
    });
    return { cart: responseCart(updatedCart.toJSON()) };
};

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
