const paypal = require("paypal-rest-sdk");

const PAYPAL_MODE = process.env.PAYPAL_MODE;
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_CLIENT_ID_SANDBOX = process.env.PAYPAL_CLIENT_ID_SANDBOX;
const PAYPAL_CLIENT_SECRET_SANDBOX = process.env.PAYPAL_CLIENT_SECRET_SANDBOX;

let configs = {
    mode: PAYPAL_MODE,
    client_id: PAYPAL_CLIENT_ID_SANDBOX,
    client_secret: PAYPAL_CLIENT_SECRET_SANDBOX
};

if (PAYPAL_MODE === "live") {
    configs = {
        mode: PAYPAL_MODE,
        client_id: PAYPAL_CLIENT_ID,
        client_secret: PAYPAL_CLIENT_SECRET
    };
}

paypal.configure(configs);

module.exports = paypal;
