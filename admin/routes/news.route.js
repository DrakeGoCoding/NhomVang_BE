const router = require('express').Router();
const newsController = require('@admin/controllers/news.controller');
const { authenticate, restrictTo } = require('@middlewares/auth.middleware');

router.use(authenticate);
router.use(restrictTo("admin"));

router.post('/', newsController.createNews);
router
	.route('/:slug')
	.put(newsController.updateNews)
	.delete(newsController.deleteNews);

module.exports = router;