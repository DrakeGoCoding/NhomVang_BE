const News = require('@models/news');
const AppError = require('@utils/appError');
const { responseNews } = require('@utils/responsor');
const { NOT_FOUND_NEWS } = require('@constants/error');

const getAllNews = async (limit = 10, offset = 0) => {
	const query = News
		.collection
		.aggregate([
			{ $sort: { modifiedDate: -1 } },
			{
				$lookup: {
					from: "users",
					localField: "author",
					foreignField: "_id",
					as: "author"
				}
			},
			{
				$facet: {
					"stage1": [{ $group: { _id: null, count: { $sum: 1 } } }],
					"stage2": [
						{ $skip: offset },
						{ $limit: limit },
						{
							$project: {
								author: { $arrayElemAt: ["$author", 0], },
								title: 1,
								content: 1,
								thumbnail: 1,
								description: 1,
								slug: 1,
								createdDate: 1,
								modifiedDate: 1
							}
						}
					]
				}
			},
			{ $unwind: "$stage1" },
			{ $project: { total: "$stage1.count", newsList: "$stage2" } }
		]);

	const data = (await query.toArray())[0];
	return {
		statusCode: 200,
		data: {
			...data,
			newsList: data ? data.newsList.map(news => responseNews(news)) : []
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
