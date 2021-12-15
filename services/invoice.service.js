const Invoice = require("@models/invoice");
const { responseInvoice } = require("@utils/responsor");

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
    products.forEach(product => {
        const { quantity, listedPrice, discountPrice } = product;
        total += listedPrice * quantity;
        discountTotal += (discountPrice || listedPrice) * quantity;
    });

    const newInvoice = await Invoice.create({
        user: userId,
        products,
        total,
        discountTotal,
        paymentMethod
    });

    return {
        statusCode: 201,
        data: { invoice: responseInvoice(newInvoice) }
    };
};

module.exports = {
    createInvoice
};
