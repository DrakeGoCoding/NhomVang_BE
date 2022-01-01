const invoiceService = require("@admin/services/invoice.service");
const { isValidId } = require("@utils/mongoose");
const AppError = require("@utils/appError");
const { INVALID_ID, MISSING_INVOICE_ID, MISSING_INVOICE_DATA } = require("@constants/error");

const getAllInvoices = async (req, res, next) => {
    try {
        const { limit, offset, ...filter } = req.query;
        const { statusCode, data } = await invoiceService.getAllInvoices(filter, limit, offset);
        res.status(statusCode).json(data);
    } catch (error) {
        next(error);
    }
};

const getInvoice = async (req, res, next) => {
    try {
        const invoiceId = req.params.invoiceId;
        if (!invoiceId) {
            throw new AppError(400, "fail", MISSING_INVOICE_ID);
        }

        if (!isValidId(invoiceId)) {
            throw new AppError(400, "fail", INVALID_ID);
        }

        const { statusCode, data } = await invoiceService.getInvoice(invoiceId);
        res.status(statusCode).json(data);
    } catch (error) {
        next(error);
    }
};

const updateInvoice = async (req, res, next) => {
    try {
        const username = req.user.username;
        const invoiceId = req.params.invoiceId;
        if (!invoiceId) {
            throw new AppError(400, "fail", MISSING_INVOICE_ID);
        }

        if (!isValidId(invoiceId)) {
            throw new AppError(400, "fail", INVALID_ID);
        }

        let invoice = req.body.invoice;
        if (!invoice) {
            throw new AppError(400, "fail", MISSING_INVOICE_DATA);
        }

        invoice = Object.assign(invoice, {
            user: undefined,
            total: undefined,
            discountTotal: undefined,
            paymentMethod: undefined,
            paymentStatus: undefined,
            paymentId: undefined,
            createdDate: undefined,
            logs: undefined
        });

        const { statusCode, data } = await invoiceService.updateInvoice(username, invoiceId, invoice);
        res.status(statusCode).json(data);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllInvoices,
    getInvoice,
    updateInvoice
};
