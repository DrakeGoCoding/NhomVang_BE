const router = require('express').Router();
const newsController = require('@admin/controllers/news.controller');

router.post('/', newsController.createNews);
router
	.route('/:slug')
	.put(newsController.updateNews)
	.delete(newsController.deleteNews);

module.exports = router;