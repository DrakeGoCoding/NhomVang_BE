const router = require("express").Router();
const { authenticate } = require("@middlewares/auth.middleware");

router.use(authenticate);

module.exports = router;
