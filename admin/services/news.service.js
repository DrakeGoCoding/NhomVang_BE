const News = require('@models/news');
const AppError = require('@utils/appError');
const { responseNews } = require('@utils/responsor');
const { NOT_FOUND_NEWS } = require('@constants/error');

/**
 * Create a news
 * @param {News} news
 * @DrakeGoCoding 11/13/2021 
 */
const createNews = async (news) => {
	let createdNews = await News.create(news);
	createdNews = await News.populate(createdNews, "author")

	return {
		statusCode: 201,
		data: { news: responseNews(createdNews.toJSON()) }
	};
}

/**
 * Update a news by slug
 * @param {String} slug
 * @param {News} news
 * @DrakeGoCoding 11/13/2021 
 */
const updateNews = async (slug, news) => {
	let updatedNews = await News.findOneAndUpdate({ slug }, news, { new: true });
	if (!updatedNews) {
		throw new AppError(404, "fail", NOT_FOUND_NEWS);
	}

	updatedNews = await News.populate(updatedNews, "author")

	return {
		statusCode: 200,
		data: { news: responseNews(updatedNews.toJSON()) }
	};
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
	updateNews,
	deleteNews
}
