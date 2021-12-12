const Cart = require("@models/cart");
const Product = require("@models/product");
const AppError = require("@utils/appError");
const { NOT_FOUND_CART, NOT_FOUND_PRODUCT } = require("@constants/error");

/**
 * Add an item to cart
 * @param {String} userId
 * @param {String} itemId
 * @param {Number} quantity
 * @DrakeGoCoding 12/12/2021
 */
const addItem = async (userId, itemId, quantity) => {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        throw new AppError(404, "fail", NOT_FOUND_CART);
    }

    const product = await Product.findById(itemId);
    if (!product) {
        throw new AppError(404, "fail", NOT_FOUND_PRODUCT);
    }

    const data = await cart.addItem(product, quantity);
    return { statusCode: 201, data };
};

/**
 * Remove an item from cart
 * @param {String} userId
 * @param {String} itemId
 * @DrakeGoCoding 12/12/2021
 */
const removeItem = async (userId, itemId) => {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        throw new AppError(404, "fail", NOT_FOUND_CART);
    }

    const data = await cart.removeItem(itemId);
    return { statusCode: 200, data };
};

/**
 * Update an item in cart
 * @param {String} userId
 * @param {String} itemId
 * @param {Number} quantity
 * @DrakeGoCoding 12/12/2021
 */
const updateItem = async (userId, itemId, quantity) => {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        throw new AppError(404, "fail", NOT_FOUND_CART);
    }

    const data = await cart.updateItem(itemId, quantity);
    return { statusCode: 200, data };
};

module.exports = {
    addItem,
    removeItem,
    updateItem
};
