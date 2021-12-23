const paypal = require("paypal-rest-sdk");

paypal.configure({
    mode: process.env.NODE_ENV === "production" ? "live" : "sandbox",
    client_id: process.env.PAYPAY_CLIENT_ID,
    client_secret: process.env.PAYPAL_CLIENT_SECRET
});

module.exports = paypal;
