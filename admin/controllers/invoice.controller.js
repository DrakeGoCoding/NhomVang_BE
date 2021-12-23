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

module.exports = {
    getAllInvoices
};
