const Notification = require("@models/notification");
const { responseNotification } = require("@utils/responsor");
const AppError = require("@utils/appError");
const { NOT_FOUND_NOTIFICATION } = require("@constants/error");

/**
 * Create new notification
 * @DrakeGoCoding 01/14/2021
 */
const createNotification = async payload => {
    const notification = await Notification.create(payload);
    return {
        statusCode: 201,
        data: { notification: responseNotification(notification.toJSON()) }
    };
};

/**
 * Get all notifications
 * @param {String} userId
 * @DrakeGoCoding 01/14/2021
 */
const getAllNotifications = async userId => {
    const notificationList = await Notification.find({ target: "admin", viewedBy: { $ne: userId } }).populate(
        "user viewedBy"
    );
    return {
        statusCode: 200,
        data: {
            notificationList: notificationList.map(notification => responseNotification(notification.toJSON()))
        }
    };
};

/**
 * Add user to notification viewlist
 * @param {String} userId
 * @param {String} notificationId
 * @DrakeGoCoding 01/14/2021
 */
const viewNotification = async (userId, notificationId) => {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
        throw new AppError(404, "fail", NOT_FOUND_NOTIFICATION);
    }

    if (!notification.viewedBy.includes(userId)) {
        notification.viewedBy.push(userId);
        await notification.save();
    }

    return await getAllNotifications(userId);
};

/**
 * Add user to all admin notification viewlist
 * @param {String} userId
 * @DrakeGoCoding 01/14/2021
 */
const viewAllNotifications = async userId => {
    const notificationList = await Notification.updateMany(
        { target: "admin", viewedBy: { $ne: userId } },
        { $push: { viewedBy: userId } },
        { new: true }
    );

    return await getAllNotifications(userId);
};

module.exports = {
    createNotification,
    getAllNotifications,
    viewNotification,
    viewAllNotifications
};
