const router = require("express").Router();
const newsletterController = require("@admin/controllers/newsletter.controller");

router.get("/", newsletterController.getAllNewsletters);
router.get("/:id", newsletterController.getNewsletter);
router.post("/", newsletterController.sendNewsletter);

module.exports = router;
