const notificationService = require("@admin/services/notification.service");

const createNotification = async (req, res, next) => {
    try {
        const payload = {
            user: req.user._id,
            ...req.body
        };
        const { statusCode, data } = await notificationService.createNotification(payload);
        res.status(statusCode).json(data);
    } catch (error) {
        next(error);
    }
};

const getAllNotifications = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { statusCode, data } = await notificationService.getAllNotifications(userId);
        res.status(statusCode).json(data);
    } catch (error) {
        next(error);
    }
};

const viewNotification = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const notificationId = req.params.id;
        const { statusCode, data } = await notificationService.viewNotification(userId, notificationId);
        res.status(statusCode).json(data);
    } catch (error) {
        next(error);
    }
};

const viewAllNotifications = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { statusCode, data } = await notificationService.viewAllNotifications(userId);
        res.status(statusCode).json(data);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createNotification,
    getAllNotifications,
    viewNotification,
    viewAllNotifications
};
