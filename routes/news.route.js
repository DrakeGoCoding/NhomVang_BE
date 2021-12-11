const router = require("express").Router();
const newsController = require("@controllers/news.controller");

router.get("/", newsController.getAllNews);
router.get("/:slug", newsController.getNews);

module.exports = router;
