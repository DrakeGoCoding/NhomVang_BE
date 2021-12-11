const router = require("express").Router();
const authController = require("@controllers/auth.controller");
const { authenticate } = require("@middlewares/auth.middleware");

router.post("/login", authController.login);
router.post("/register", authController.register);

router.use(authenticate);
router.put("/update", authController.updateUser);
router.get("/current", authController.getCurrentUser);

module.exports = router;
