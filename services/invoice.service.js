const Invoice = require("@models/invoice");
const Cart = require("@models/cart");
const { responseInvoice } = require("@utils/responsor");
const AppError = require("@utils/appError");
const { FORBIDDEN, NOT_FOUND_INVOICE, NOT_FOUND_CART, NOT_FOUND_PRODUCT_IN_CART } = require("@constants/error");
const { createPayment, executePayment, refundPayment, getPaymentById } = require("@utils/paypal");

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
 * @DrakeGoCoding 12/15/2021
 */
const createInvoice = async (userId, products) => {
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

    cart.items = cart.items.filter(item => toRemoveFromCart.includes(item._id));
    products = products.filter(item => toRemoveFromCart.includes(item._id.toString()));

    const newInvoice = await Invoice.create({
        user: userId,
        products,
        total: parseFloat(total.toFixed(2)),
        discountTotal: parseFloat(discountTotal.toFixed(2))
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
    const invoice = await Invoice.findOne({ _id: invoiceId, user: userId });
    if (!invoice) {
        throw new AppError(404, "fail", NOT_FOUND_INVOICE);
    }

    if (invoice.status === "in_progress" || invoice.status === "delivered") {
        throw new AppError(403, "fail", FORBIDDEN);
    }

    const payment = await getPaymentById(invoice.paymentId);
    const amount = invoice.discountTotal || invoice.total;
    const saleId = payment.transactions[0].related_resources[0].sale.id;
    await refundPayment(saleId, amount);

    invoice.status === "failed";
    invoice.logs.push({
        user: userId,
        action: "cancel"
    });
    await invoice.save();

    return {
        statusCode: 200,
        data: { status: "success", invoice: invoiceId }
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

const payWithPaypalSuccess = async (paymentId, payerId) => {
    const payment = await executePayment(paymentId, payerId);
    const invoiceId = payment.transactions[0].invoice_number;

    const invoice = await Invoice.findById(invoiceId);
    invoice.paymentMethod = "PayPal";
    invoice.paymentStatus = "done";
    invoice.paymentId = paymentId;
    invoice.status = "in_progress";
    invoice.logs.push({
        user: invoice.user,
        action: "change_status",
        nextStatus: invoice.status
    });
    await invoice.save();

    return {
        statusCode: 200,
        url: `${process.env.APP_END_USER}/user/purchase/?type=in_progress`
    };
};

const payWithPaypalCancel = async () => {
    return {
        statusCode: 200,
        url: `${process.env.APP_END_USER}/user/purchase/?type=pending`
    };
};

const payWithStripe = async (userId, invoiceId) => {};

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
