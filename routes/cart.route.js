const router = require("express").Router();
const cartController = require("@controllers/cart.controller");
const { authenticate, restrictTo } = require("@middlewares/auth.middleware");

router.use(authenticate);
router.use(restrictTo("user"));

router.post("/add", cartController.addItem);
router.post("/update", cartController.updateItem);
router.post("/remove", cartController.removeItem);

module.exports = router;
