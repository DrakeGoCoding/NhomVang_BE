const cloudinary = require("./cloudinary");
const paypal = require("./paypal");
const stripe = require("./stripe");
const transporter = require("./nodemailer");

module.exports = {
    cloudinary,
    paypal,
    stripe,
    transporter
};
