const { paypal } = require("@configs");
const AppError = require("@utils/appError");

const createPayment = invoice => {
    const { _id, products, total, discountTotal } = invoice;
    const items = products.map(item => {
        return {
            name: item.name,
            sku: item._id,
            price: (item.discountPrice || item.listedPrice).toFixed(2),
            quantity: item.quantity,
            currency: "USD"
        };
    });
    const create_payment_json = {
        intent: "sale",
        payer: {
            payment_method: "paypal"
        },
        redirect_urls: {
            return_url: `${process.env.APP_URL}/invoices/paypal/success`,
            cancel_url: `${process.env.APP_URL}/invoices/paypal/cancel`
        },
        transactions: [
            {
                invoice_number: _id,
                item_list: { items },
                amount: {
                    currency: "USD",
                    total: (discountTotal || total).toFixed(2)
                }
            }
        ]
    };

    return new Promise(function (resolve, reject) {
        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                const { httpStatusCode, message } = error.response;
                reject(new AppError(httpStatusCode, "fail", message));
            } else {
                resolve(payment);
            }
        });
    });
};

const executePayment = (paymentId, payerId) => {
    const execute_payment_json = {
        payer_id: payerId
    };

    return new Promise(function (resolve, reject) {
        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
            if (error) {
                const { httpStatusCode, message } = error.response;
                reject(new AppError(httpStatusCode, "fail", message));
            } else {
                resolve(payment);
            }
        });
    });
};

const refundPayment = (saleId, amount) => {
	const refund_details = {
		amount: {
			currency: "USD",
			total: amount.toString()
		}
	}
    return new Promise(function (resolve, reject) {
        paypal.sale.refund(saleId, refund_details, function(error, refund) {
			if (error) {
                const { httpStatusCode, message } = error.response;
                reject(new AppError(httpStatusCode, "fail", message));
            } else {
                resolve(refund);
            }
		})
    });
};

const getPaymentById = paymentId => {
    return new Promise(function (resolve, reject) {
        paypal.payment.get(paymentId, function (error, payment) {
            if (error) {
                const { httpStatusCode, message } = error.response;
                reject(new AppError(httpStatusCode, "fail", message));
            } else {
                resolve(payment);
            }
        });
    });
};

module.exports = {
    createPayment,
    executePayment,
    refundPayment,
    getPaymentById
};
