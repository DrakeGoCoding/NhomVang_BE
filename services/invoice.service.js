const Invoice = require("../models/invoice");
const { responseInvoice } = require("@utils/responsor");
const AppError = require("@utils/appError");
const { NOT_FOUND_INVOICE } = require("@constants/error");

/**
 * Create a new invoice
 * @param {String} userId
 * @param {Array} products
 * @param {String} paymentMethod
 * @DrakeGoCoding 12/15/2021
 */
const createInvoice = async (userId, products, paymentMethod) => {
    let total = 0;
    let discountTotal = 0;
    for (const product of products) {
        const { quantity, listedPrice, discountPrice } = product;
        total += listedPrice * quantity;
        discountTotal += (discountPrice || listedPrice) * quantity;
    }

    const newInvoice = await Invoice.create({
        user: userId,
        products,
        total,
        discountTotal,
        paymentMethod
    });

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
