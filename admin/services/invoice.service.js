const Invoice = require("@models/invoice");
const User = require("@models/user");
const { responseInvoice } = require("@utils/responsor");
const sendEmail = require("../../utils/email/nodemailer");
const AppError = require("@utils/appError");
const { INVALID_INVOICE_ID, INVALID_INVOICE_STATUS, NOT_FOUND_USER, NOT_FOUND_INVOICE } = require("@constants/error");
const { INVOICE_DELIVER_SUCCESS, INVOICE_CANCEL } = require("@constants/message");

/**
 * Get all invoices
 * @param {{
 * 		user: String,
 * 		date: String
 * }} filter
 * @param {Number} limit
 * @param {Number} offset
 * @DrakeGoCoding 12/23/2021
 */
const getAllInvoices = async (filter = {}, limit = 10, offset = 0) => {
    const aggregation = [
        { $sort: { createdDate: -1 } },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $facet: {
                stage1: [{ $group: { _id: null, count: { $sum: 1 } } }],
                stage2: [
                    { $skip: offset },
                    { $limit: limit },
                    {
                        $project: {
                            user: { $arrayElemAt: ["$user", 0] },
                            products: 1,
                            total: 1,
                            discountTotal: 1,
                            paymentMethod: 1,
                            paymentStatus: 1,
                            paymentId: 1,
                            vouchers: 1,
                            status: 1,
                            createdDate: 1,
                            logs: 1
                        }
                    }
                ]
            }
        },
        { $unwind: "$stage1" },
        { $project: { total: "$stage1.count", invoiceList: "$stage2" } }
    ];

    if (filter.user) {
        const user = await User.findOne({ username: filter.user });
        if (!user) {
            throw new AppError(404, "fail", NOT_FOUND_USER);
        }
        aggregation.unshift({
            $match: { user: user._id }
        });
    }

    if (filter.date) {
        const date = new Date(filter.date);
        date.setUTCHours(0, 0, 0, 0);
        const nextDate = new Date(filter.date);
        nextDate.setDate(date.getDate() + 1);
        nextDate.setUTCHours(0, 0, 0, 0);
        aggregation.unshift({
            $match: { createdDate: { $gte: date, $lt: nextDate } }
        });
    }

    const query = await Invoice.collection.aggregate(aggregation);
    const data = (await query.toArray())[0];

    return {
        statusCode: 200,
        data: {
            ...data,
            invoiceList: data ? data.invoiceList.map(invoice => responseInvoice(invoice)) : []
        }
    };
};

/**
 * Get invoice by id
 * @param {String} invoiceId
 * @DrakeGoCoding 12/24/2021
 */
const getInvoice = async invoiceId => {
    const invoice = await Invoice.findById(invoiceId).populate("user");
    if (!invoice) {
        throw new AppError(404, "fail", NOT_FOUND_INVOICE);
    }

    return {
        statusCode: 200,
        data: { invoice: responseInvoice(invoice.toJSON()) }
    };
};

/**
 * Update an invoice by id
 * @param {String} invoiceId
 * @param {Invoice} invoice
 * @DrakeGoCoding 12/26/2021
 */
const updateInvoice = async (username, invoiceId, invoice) => {
    let updatedInvoice = await Invoice.findById(invoiceId).populate("user");
    if (!updatedInvoice || invoiceId.toString() !== invoice._id.toString()) {
        throw new AppError(400, "fail", INVALID_INVOICE_ID);
    }

    if (!["delivered", "failed"].includes(invoice.status)) {
        throw new AppError(400, "fail", INVALID_INVOICE_STATUS);
    }

    if (invoice.status === "delivered") {
        updatedInvoice.logs.push({
            user: username,
            action: "change_status",
            prevStatus: updatedInvoice.status,
            nextStatus: "delivered"
        });
        updatedInvoice.status = "delivered";
        updatedInvoice.products = invoice.products;

        sendEmail(updatedInvoice.user.email, INVOICE_DELIVER_SUCCESS, "invoiceDeliver.handlebars", {
            id: updatedInvoice._id.toString(),
            invoice: updatedInvoice,
            date: new Date().toDateString()
        });
    } else if (invoice.status === "failed") {
        // refund if paymentStatus is done
        if (updatedInvoice.paymentStatus === "done" && updatedInvoice.paymentId) {
            const payment = await getPaymentById(updatedInvoice.paymentId);
            const amount = updatedInvoice.discountTotal || updatedInvoice.total;
            const saleId = payment.transactions[0].related_resources[0].sale.id;
            await refundPayment(saleId, amount);
        }
        updatedInvoice.logs.push({
            user: username,
            action: "cancel"
        });
        updatedInvoice.status = "failed";
        updatedInvoice.paymentStatus = "cancel";

        sendEmail(updatedInvoice.user.email, INVOICE_CANCEL, "invoiceCancel.handlebars", {
            id: updatedInvoice._id.toString(),
            invoice: updatedInvoice,
            date: new Date().toDateString()
        });
    }

    updatedInvoice = await updatedInvoice.save();

    return {
        statusCode: 200,
        data: { status: "success", invoice: responseInvoice(updatedInvoice.toJSON()) }
    };
};

module.exports = {
    getAllInvoices,
    getInvoice,
    updateInvoice
};
