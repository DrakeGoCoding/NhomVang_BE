const newsService = require("@services/news.service");
const { UNDEFINED_ROUTE } = require("@constants/error");

const getAllNews = async (req, res, next) => {
    try {
        const { limit, offset, ...filter } = req.query;
        const { statusCode, data } = await newsService.getAllNews(filter, limit, offset);
        res.status(statusCode).json(data);
    } catch (error) {
        next(error);
    }
};

const getNews = async (req, res, next) => {
    try {
        const slug = req.params.slug;
        if (!slug) {
            throw new AppError(400, "fail", UNDEFINED_ROUTE);
        }

        const { statusCode, data } = await newsService.getNews(slug);
        res.status(statusCode).json(data);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllNews,
    getNews
};
