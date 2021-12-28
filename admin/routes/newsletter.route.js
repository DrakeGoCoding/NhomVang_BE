const router = require("express").Router();
const newsletterController = require("@admin/controllers/newsletter.controller");

router.get("/", newsletterController.getAllNewsletters);
router.post("/", newsletterController.sendNewsletter);

module.exports = router;
