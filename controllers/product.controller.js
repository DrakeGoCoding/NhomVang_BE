const productService = require('@services/product.service');

const getAllProducts = async (req, res, next) => {
	try {
		const { limit, offset, ...filter } = req.query;
		if (!filter.minPrice || filter.minPrice && typeof filter.minPrice !== 'number') {
			filter.minPrice = 0;
		}
		if (!filter.maxPrice || filter.maxPrice && typeof filter.maxPrice !== 'number') {
			filter.maxPrice = Infinity
		}
		const {statusCode, data } = await productService.getAllProducts(filter, limit, offset);
		res.status(statusCode).json(data);
	} catch (error) {
		next(error);
	}
}

const getProduct = async (req, res, next) => {
	try {
		const slug = req.params.slug;
		if (!slug) {
			throw new AppError(400, "fail", UNDEFINED_ROUTE);
		}
		
		const { statusCode, data } = await productService.getProduct(slug);
		res.status(statusCode).json(data);
	} catch (error) {
		next(error);
	}
}

module.exports = {
	getAllProducts,
	getProduct
}
