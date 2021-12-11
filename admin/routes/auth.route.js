const router = require("express").Router();
const authController = require("@admin/controllers/auth.controller");

router.post("/login", authController.login);

module.exports = router;
