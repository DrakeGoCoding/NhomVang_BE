const Invoice = require("../models/invoice");
const Cart = require("../models/cart");
const { responseInvoice } = require("@utils/responsor");
const AppError = require("@utils/appError");
const { NOT_FOUND_INVOICE, NOT_FOUND_CART } = require("@constants/error");

/**
 * Create a new invoice
 * @param {String} userId
 * @param {Array} products
 * @param {String} paymentMethod
 * @DrakeGoCoding 12/15/2021
 */
const createInvoice = async (userId, products, paymentMethod) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        throw new AppError(404, "fail", NOT_FOUND_CART);
    }

    let total = 0;
    let discountTotal = 0;
    const toRemoveFromCart = [];
    for (const product of products) {
        const { _id, quantity, listedPrice, discountPrice } = product;
        total += listedPrice * quantity;
        discountTotal += (discountPrice || listedPrice) * quantity;
        toRemoveFromCart.push(_id);
    }

    cart.items = cart.items.filter(item => toRemoveFromCart.includes(item._id.toString()));

    const newInvoice = await Invoice.create({
        user: userId,
        products,
        total,
        discountTotal,
        paymentMethod
    });

	await cart.save();

    return {
        statusCode: 201,
        data: { invoice: responseInvoice(newInvoice.toJSON()) }
    };
};

/**
 * Cancel an invoice with invoice id and user id
 * @param {String} userId
 * @param {String} invoiceId
 */
const cancelInvoice = async (userId, invoiceId) => {
    const invoice = await Invoice.findOneAndDelete({ _id: invoiceId, user: userId });
    if (!invoice) {
        throw new AppError(404, "fail", NOT_FOUND_INVOICE);
    }

    return {
        statusCode: 200,
        data: { invoice: invoiceId }
    };
};

const payWithPaypal = async (userId, invoiceId) => {};

const payWithStripe = async (userId, invoiceId) => {};

module.exports = {
    createInvoice,
    cancelInvoice,
    payWithPaypal,
    payWithStripe
};
