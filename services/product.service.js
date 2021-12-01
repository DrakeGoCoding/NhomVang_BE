// const Product = require('@models/product');
const Product = require('../models/product');
const AppError = require('@utils/appError');
const { responseProduct } = require('@utils/responsor');
const { NOT_FOUND_PRODUCT } = require('@constants/error');

/**
 * Get all products data
 * @param {{
 * 		hot: Boolean,
 * 		inSlider: Boolean,
 * 		name: String,
 * 		minPrice: Number,
 * 		maxPrice: Number
 * }} filter
 * @param {Number} limit 
 * @param {Number} offset 
 * @DrakeGoCoding 12/01/2021
 */
const getAllProducts = async (filter = {}, limit = 10, offset = 0) => {
	const query = Product
		.collection
		.find()
		.sort({ modifiedDate: -1 });

	const total = await query.count();
	const productList = await query.skip(offset).limit(limit).toArray();

	if (!total || !productList || productList.length === 0) {
		return {
			statusCode: 200,
			data: {
				productList: [],
				total: 0
			}
		}
	}

	return {
		statusCode: 200,
		data: {
			productList: productList.map(product => responseProduct(product)),
			total
		}
	};
}

/**
 * Get a product by slug
 * @param {String} slug 
 * @DrakeGoCoding 12/02/2021
 */
const getProduct = async (slug) => {
	const product = await Product.findOne({ slug });
	if (!product) {
		throw new AppError(404, "fail", NOT_FOUND_PRODUCT);
	}

	return {
		statusCode: 200,
		data: { product: responseProduct(product.toJSON()) }
	};
}

module.exports = {
	getAllProducts,
	getProduct
}
