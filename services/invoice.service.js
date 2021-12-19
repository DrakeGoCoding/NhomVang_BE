const Invoice = require("../models/invoice");
const Cart = require("../models/cart");
const { responseInvoice } = require("@utils/responsor");
const AppError = require("@utils/appError");
const { FORBIDDEN, NOT_FOUND_INVOICE, NOT_FOUND_CART, NOT_FOUND_PRODUCT_IN_CART } = require("@constants/error");
const { createPayment } = require("../utils/paypal");

/**
 * Get all invoices by user id
 * @param {String} userId
 * @DrakeGoCoding 12/19/2021
 */
const getAllInvoices = async userId => {
    const invoiceList = await Invoice.find({ user: userId });
    return {
        statusCode: 200,
        data: {
            invoiceList: invoiceList.map(invoice => responseInvoice(invoice.toJSON())),
            total: invoiceList.length
        }
    };
};

/**
 * Get invoice by id
 * @param {String} userId
 * @param {String} invoiceId
 * @DrakeGoCoding 12/19/2021
 */
const getInvoice = async (userId, invoiceId) => {
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
        throw new AppError(404, "fail", NOT_FOUND_INVOICE);
    }

    if (invoice.user.toString() !== userId.toString()) {
        throw new AppError(403, "fail", FORBIDDEN);
    }

    return {
        statusCode: 200,
        data: responseInvoice(invoice.toJSON())
    };
};

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
		if (cart.items.findIndex(item => item._id.toString() === _id) >= 0) {
            total += listedPrice * quantity;
            discountTotal += (discountPrice || listedPrice) * quantity;
            toRemoveFromCart.push(_id);
        }
    }

    if (toRemoveFromCart.length === 0) {
        throw new AppError(400, "fail", NOT_FOUND_PRODUCT_IN_CART);
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

const payWithPaypal = async (userId, invoiceId) => {
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
        throw new AppError(404, "fail", NOT_FOUND_INVOICE);
    }

    if (invoice.user.toString() !== userId.toString()) {
        throw new AppError(403, "fail", FORBIDDEN);
    }

    const payment = await createPayment(invoice);
    const approveUrl = payment.links.find(link => link.rel === "approval_url");

    return {
        statusCode: payment.statusCode,
        url: approveUrl.href
    };
};

const payWithPaypalSuccess = async (userId, invoiceId) => {

}

const payWithPaypalCancel = async (userId, invoiceId) => {

}

const payWithStripe = async (userId, invoiceId) => {

};

module.exports = {
    getAllInvoices,
    getInvoice,
    createInvoice,
    cancelInvoice,
    payWithPaypal,
	payWithPaypalSuccess,
	payWithPaypalCancel,
    payWithStripe
};
