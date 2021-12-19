const { paypal } = require("@configs");
const AppError = require("@utils/appError");
const { SYSTEM_ERROR } = require("@constants/error");

const createPayment = invoice => {
    const { _id, products } = invoice;
    const items = products.map(item => {
        return {
            name: item.name,
            sku: item._id,
            price: ((item.discountPrice || item.listedPrice) / 23000).toFixed(2),
            quantity: item.quantity,
            currency: "USD"
        };
    });
    const total = items.reduce((sum, item) => sum + Number.parseFloat(item.price) * item.quantity, 0);
    const create_payment_json = {
        intent: "sale",
        payer: {
            payment_method: "paypal"
        },
        redirect_urls: {
            return_url: `https://nhomvang-be.herokuapp.com/paypal/success/${_id}`,
            cancel_url: `https://nhomvang-be.herokuapp.com/paypal/cancel/${_id}`
        },
        transactions: [
            {
                invoice_number: _id,
                item_list: { items },
                amount: {
                    currency: "USD",
                    total: total.toFixed(2)
                }
            }
        ]
    };

    return new Promise(function (resolve, reject) {
        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                console.log(error.response);
                reject(new AppError(500, "fail", SYSTEM_ERROR));
            } else {
                resolve(payment);
            }
        });
    });
};

const getPaymentById = paymentId => {
    return new Promise(function (resolve, reject) {
        paypal.payment.get(paymentId, function (error, payment) {
            if (error) {
                console.log(error.response);
                reject(new AppError(500, "fail", SYSTEM_ERROR));
            } else {
                resolve(payment);
            }
        });
    });
};

module.exports = {
    createPayment,
    getPaymentById
};
