const Invoice = require("@models/invoice");
const { responseInvoice } = require("@utils/responsor");
const AppError = require("@utils/appError");

/**
 * Get all invoices
 * @param {{
 * 		user: String,
 * }} filter
 * @param {Number} limit
 * @param {Number} offset
 * @DrakeGoCoding 12/23/2021
 */
const getAllInvoices = async (filter = {}, limit = 10, offset = 0) => {
	console.log(filter);
    const result = await Invoice.collection.find().sort({ createdDate: -1 });
    const total = await result.count();
    const invoiceList = await result.skip(offset).limit(limit).toArray();

    return {
        statusCode: 200,
        data: {
            invoiceList: invoiceList.map(invoice => responseInvoice(invoice)),
            total
        }
    };
};

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
