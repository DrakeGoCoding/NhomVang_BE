const newsService = require('@admin/services/news.service');
const AppError = require('@utils/appError');
const { MISSING_NEWS_INPUT, UNDEFINED_ROUTE } = require('@constants/error');

const createNews = async (req, res, next) => {
	try {
		const author = req.user._id;

		let news = req.body.news;
		if (!news) {
			throw new AppError(400, "fail", MISSING_NEWS_INPUT);
		}

		const { title, content } = news;
		if (!title || !content) {
			throw new AppError(400, "fail", MISSING_NEWS_INPUT);
		}

		news = Object.assign(news, {
			author: undefined,
			slug: undefined,
			createdDate: undefined,
			modifiedDate: Date.now()
		});

		const { statusCode, data } = await newsService.createNews({ ...news, author })
		res.status(statusCode).json(data);
	} catch (error) {
		next(error);
	}
}

const updateNews = async (req, res, next) => {
	try {
		const author = req.user._id;
		
		const { slug } = req.params;
		if (!slug) {
			throw new AppError(400, "fail", UNDEFINED_ROUTE);
		}
		
		let news = req.body.news;
		if (!news) {
			throw new AppError(400, "fail", MISSING_NEWS_INPUT);
		}

		const { title, content } = news;
		if (!title || !content) {
			throw new AppError(400, "fail", MISSING_NEWS_INPUT);
		}

		news = Object.assign(news, {
			author: undefined,
			slug: undefined,
			createdDate: undefined,
			modifiedDate: Date.now()
		});

		const { statusCode, data } = await newsService.updateNews(slug, { ...news, author });
		res.status(statusCode).json(data);
	} catch (error) {
		next(error);
	}
}

const deleteNews = async (req, res, next) => {
	try {
		const { slug } = req.params;

		// check if slug are filled
		if (!slug) {
			throw new AppError(400, "fail", UNDEFINED_ROUTE);
		}

		const { statusCode, data } = await newsService.deleteNews(slug);
		res.status(statusCode).json(data);
	} catch (error) {
		next(error);
	}
}

module.exports = {
	createNews,
	updateNews,
	deleteNews
}
