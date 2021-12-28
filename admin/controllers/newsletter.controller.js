const newsletterService = require("@admin/services/newsletter.service");
const AppError = require("@utils/appError");
const { MISSING_NEWSLETTER_CONTENT } = require("@constants/error");

const getAllNewsletters = async (req, res, next) => {
    try {
        const { limit, offset } = req.query;
        const { statusCode, data } = await newsletterService.getAllNewsletters(limit, offset);
        res.status(statusCode).json(data);
    } catch (error) {
        next(error);
    }
};

const sendNewsletter = async (req, res, next) => {
    try {
        const { subject, content } = req.body.newsletter;
        if (!content) {
            throw new AppError(400, "fail", MISSING_NEWSLETTER_CONTENT);
        }

        const { statusCode, data } = await newsletterService.sendNewsletter(subject, content);
        res.status(statusCode).json(data);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllNewsletters,
    sendNewsletter
};
