const News = require('@models/news');
const AppError = require('@utils/appError');
const { responseNews } = require('@utils/responsor');
const { NOT_FOUND_NEWS } = require('@constants/error');

const getAllNews = async (limit = 7, offset = 0) => {
	const newsList = await News.find()
		.sort({ modifiedDate: -1 })
		.skip(offset)
		.limit(limit);

	return {
		statusCode: newsList.length > 0 ? 200 : 204,
		data: { newsList: [] || newsList.map(news => responseNews(news.toJSON())) }
	}
}

/**
 * Get a news data by slug
 * @param {String} slug 
 * @DrakeGoCoding 11/13/2021
 */
const getNews = async (slug) => {
	const news = await News.findOne({ slug }).populate('author');
	if (!news) {
		throw new AppError(404, "fail", NOT_FOUND_NEWS);
	}
	return {
		statusCode: 200,
		data: { news: responseNews(news.toJSON()) }
	};
}

module.exports = {
	getAllNews,
	getNews
}
