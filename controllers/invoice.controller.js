const invoiceService = require("@services/invoice.service");
const AppError = require("@utils/appError");
const {
    MISSING_INVOICE_PRODUCTS,
    INVALID_INVOICE_PRODUCTS,
    MISSING_INVOICE_ID,
    MISSING_PAYMENT_METHOD
} = require("@constants/error");

const getAllInvoices = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { statusCode, data } = await invoiceService.getAllInvoices(userId);
        res.status(statusCode).json(data);
    } catch (error) {
        next(error);
    }
};

const getInvoice = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const invoiceId = req.params.invoiceId;
        if (!invoiceId) {
            throw new AppError(400, "fail", MISSING_INVOICE_ID);
        }

        const { statusCode, data } = await invoiceService.getInvoice(userId, invoiceId);
        res.status(statusCode).json(data);
    } catch (error) {
        next(error);
    }
};

const createInvoice = async (req, res, next) => {
    try {
        const { _id, username } = req.user;
        const products = req.body.products;
        if (!Array.isArray(products) || !products.length) {
            throw new AppError(400, "fail", MISSING_INVOICE_PRODUCTS);
        }

        const requiredProps = ["_id", "listedPrice", "quantity"];
        const isValidProducts = products.every(product => {
            return requiredProps.every(prop => Object.prototype.hasOwnProperty.call(product, prop));
        });

        if (!isValidProducts) {
            throw new AppError(400, "fail", INVALID_INVOICE_PRODUCTS);
        }

        const { statusCode, data } = await invoiceService.createInvoice(_id, username, products);
        res.status(statusCode).json(data);
    } catch (error) {
        next(error);
    }
};

const payInvoice = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { invoice: invoiceId, method: paymentMethod } = req.query;
        if (!invoiceId) {
            throw new AppError(400, "fail", MISSING_INVOICE_ID);
        }

        if (!paymentMethod) {
            throw new AppError(400, "fail", MISSING_PAYMENT_METHOD);
        }

        const { statusCode, data } = await invoiceService.payInvoice(userId, invoiceId, paymentMethod);
        res.status(statusCode).json(data);
    } catch (error) {
        next(error);
    }
};

const cancelInvoice = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const invoiceId = req.params.invoiceId;
        if (!invoiceId) {
            throw new AppError(400, "fail", MISSING_INVOICE_ID);
        }

        const { statusCode, data } = await invoiceService.cancelInvoice(userId, invoiceId);
        res.status(statusCode).json(data);
    } catch (error) {
        next(error);
    }
};

const payWithPaypal = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const invoiceId = req.params.invoiceId;
        if (!invoiceId) {
            throw new AppError(400, "fail", MISSING_INVOICE_ID);
        }

        const { statusCode, data } = await invoiceService.payWithPaypal(userId, invoiceId);
        res.status(statusCode).json(data);
    } catch (error) {
        next(error);
    }
};

const payWithPaypalSuccess = async (req, res, next) => {
    try {
        const { PayerID: payerId, paymentId } = req.query;
        const { statusCode, url } = await invoiceService.payWithPaypalSuccess(paymentId, payerId);
        res.status(statusCode).redirect(url);
    } catch (error) {
        next(error);
    }
};

const payWithPaypalCancel = async (req, res, next) => {
    try {
        const { statusCode, url } = await invoiceService.payWithPaypalCancel();
        res.status(statusCode).redirect(url);
    } catch (error) {
        next(error);
    }
};

const payWithStripe = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const invoiceId = req.params.invoiceId;
        if (!invoiceId) {
            throw new AppError(400, "fail", MISSING_INVOICE_ID);
        }

        const { statusCode, data } = await invoiceService.payWithStripe(userId, invoiceId);
        res.status(statusCode).json(data);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllInvoices,
    getInvoice,
    createInvoice,
    payInvoice,
    cancelInvoice,
    payWithPaypal,
    payWithPaypalSuccess,
    payWithPaypalCancel,
    payWithStripe
};
