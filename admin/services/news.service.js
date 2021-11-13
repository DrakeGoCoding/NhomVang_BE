const News = require('../../models/news');
const AppError = require('@utils/appError');
const { responseNews } = require('@utils/responsor');
const { NOT_FOUND_NEWS } = require('@constants/error');

/**
 * Create a news
 * @param {News} news
 * @DrakeGoCoding 11/13/2021 
 */
const createNews = async (news) => {
	return {
		statusCode: 201,
		data: {}
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

/**
 * Update a news by slug
 * @param {String} slug
 * @param {News} news
 * @DrakeGoCoding 11/13/2021 
 */
const updateNews = async (slug, news) => {
	return {
		statusCode: 200,
		data: {}
	}
}

/**
 * Delete a news by slug
 * @param {String} slug 
 */
const deleteNews = async (slug) => {
	const news = await News.findOneAndDelete({ slug }, { new: true });
	if (!news) {
		throw new AppError(404, "fail", NOT_FOUND_NEWS);
	}

	return {
		statusCode: 204,
		data: null
	}
}

module.exports = {
	createNews,
	getNews,
	updateNews,
	deleteNews
}
