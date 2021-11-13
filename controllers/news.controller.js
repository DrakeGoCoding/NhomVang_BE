const newsService = require('@services/news.service');
const AppError = require('@utils/appError');
const { UNDEFINED_ROUTE } = require('@constants/error');

const getAllNews = async (req, res, next) => {
	try {
		const { limit, offset } = req.query;
		const { statusCode, data } = await newsService.getAllNews(limit, offset);
		res.status(statusCode).json(data);
	} catch (error) {
		next(error);
	}
}

const getNews = async (req, res, next) => {
	try {
		const { slug } = req.params;

		// check if slug are filled
		if (!slug) {
			throw new AppError(400, "fail", UNDEFINED_ROUTE);
		}

		const { statusCode, data } = await newsService.getNews(slug);
		res.status(statusCode).json(data);
	} catch (error) {
		next(error);
	}
}

module.exports = {
	getAllNews,
	getNews
}
