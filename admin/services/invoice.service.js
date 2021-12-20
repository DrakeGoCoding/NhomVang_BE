const Invoice = require("@models/invoice");
const { responseInvoice } = require("@utils/responsor");
const AppError = require("@utils/appError");

const getAllInvoices = async () => {};

const getInvoice = async invoiceId => {
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
        throw new AppError(404, "fail", NOT_FOUND_INVOICE);
    }

    return {
        statusCode: 200,
        data: responseInvoice(invoice.toJSON())
    };
};

module.exports = {
    getAllInvoices,
    getInvoice
};
