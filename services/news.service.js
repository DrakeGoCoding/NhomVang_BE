const News = require('@models/news');
const AppError = require('@utils/appError');
const { responseNews } = require('@utils/responsor');
const { NOT_FOUND_NEWS } = require('@constants/error');

const getAllNews = async (limit = 7, offset = 0) => {
	console.log(limit, offset);
	const query = News
		.collection
		.find()
		.sort({ modifiedDate: -1 });
	const newsList = await query.skip(offset).limit(limit).toArray();

	if (!newsList || newsList.length === 0) {
		return {
			statusCode: 204,
			data: {
				newsList: [],
				total: 0
			}
		};
	}

	return {
		statusCode: 200,
		data: { 
			newsList: newsList.map(news => responseNews(news)),
			total: newsList.length
		}
	};
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
