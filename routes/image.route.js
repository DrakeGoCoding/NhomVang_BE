const router = require("express").Router();
const imageController = require("@controllers/image.controller");
const { authenticate } = require("@middlewares/auth.middleware");

router.use(authenticate);

router.post("/upload", imageController.upload);
router.delete("/:id", imageController.deleteImage);

module.exports = router;
