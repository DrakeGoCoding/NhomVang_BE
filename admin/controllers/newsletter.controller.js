const newsletterService = require("@admin/services/newsletter.service");
const { isValidId } = require("@utils/mongoose");
const AppError = require("@utils/appError");
const { INVALID_ID, MISSING_NEWSLETTER_ID, MISSING_NEWSLETTER_CONTENT } = require("@constants/error");

const getAllNewsletters = async (req, res, next) => {
    try {
        const { limit, offset } = req.query;
        const { statusCode, data } = await newsletterService.getAllNewsletters(limit, offset);
        res.status(statusCode).json(data);
    } catch (error) {
        next(error);
    }
};

const getNewsletter = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new AppError(400, "fail", MISSING_NEWSLETTER_ID);
        }

        if (!isValidId(id)) {
            throw new AppError(400, "fail", INVALID_ID);
        }

        const { statusCode, data } = await newsletterService.getNewsletter(id);
        res.status(statusCode).json(data);
    } catch (error) {
        next(error);
    }
};

const sendNewsletter = async (req, res, next) => {
    try {
        const senderId = req.user._id;
        const { subject, content } = req.body.newsletter;
        if (!content) {
            throw new AppError(400, "fail", MISSING_NEWSLETTER_CONTENT);
        }

        const { statusCode, data } = await newsletterService.sendNewsletter(senderId, subject, content);
        res.status(statusCode).json(data);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllNewsletters,
    getNewsletter,
    sendNewsletter
};
