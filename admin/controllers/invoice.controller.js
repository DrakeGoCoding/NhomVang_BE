const invoiceService = require("@admin/services/invoice.service");
const AppError = require("@utils/appError");

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

        const { statusCode, data } = await invoiceService.getInvoice(invoiceId);
        res.status(statusCode).json(data);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllInvoices,
	getInvoice
};
