const router = require("express").Router();
const notificationController = require("@admin/controllers/notification.controller");
const { authenticate, restrictTo } = require("@middlewares/auth.middleware");

router.use(authenticate);
router.use(restrictTo("admin"));

router.get("/", notificationController.getAllNotifications);
router.post("/", notificationController.createNotification);
router.post("/view/:id", notificationController.viewNotification);
router.post("/viewAll", notificationController.viewAllNotifications);

module.exports = router;
