const transporter = require("@configs/nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const sendEmail = async (email, subject, template, payload) => {
    if (!email) return;

    try {
        const source = fs.readFileSync(path.join(__dirname, `./template/${template}`), "utf-8");
        const compiledTemplate = handlebars.compile(source);

        const mailOptions = {
            from: process.env.NODEMAILER_EMAIL,
            to: email,
            subject: subject,
            html: compiledTemplate(payload, {
				allowProtoPropertiesByDefault: true,
				allowProtoMethodsByDefault: true
			})
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email ${info.messageId} is sent to ${email}`);
    } catch (error) {
        console.log(error);
    }
};

module.exports = sendEmail;
