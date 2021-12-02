const Product = require('@models/product');
const AppError = require('@utils/appError');
const { responseProduct } = require('@utils/responsor');
const { NOT_FOUND_PRODUCT } = require('@constants/error');

/**
 * Get all products data
 * @param {{
 * 		hot: Boolean,
 * 		inSlider: Boolean,
 * 		name: String,
 * 		supplier: String,
 * 		minPrice: Number,
 * 		maxPrice: Number
 * }} filter
 * @param {Number} limit 
 * @param {Number} offset 
 * @DrakeGoCoding 12/01/2021
 */
const getAllProducts = async (
	filter = {},
	limit = 10,
	offset = 0
) => {
	console.log(filter);
	const query = {
		$and: [
			{ name: { $regex: new RegExp(filter.name, "i") } },
			{ supplier: { $regex: new RegExp(filter.supplier, "i") } },
			{
				$or: [
					{ discountPrice: { $exists: true, $gte: filter.minPrice, $lte: filter.maxPrice } },
					{
						$and: [
							{ discountPrice: { $exists: false } },
							{ listedPrice: { $gte: filter.minPrice, $lte: filter.maxPrice } },
						]
					}
				]
			}
		]
	};
	if (typeof filter.hot === 'boolean') {
		query.$and.push({ isHot: filter.hot });
	}
	if (typeof filter.inSlider === 'boolean') {
		query.$and.push({ isInSlider: filter.inSlider });
	}

	const result = Product
		.collection
		.find(query)
		.sort({ modifiedDate: -1 });

	const total = await result.count();
	const productList = await result.skip(offset).limit(limit).toArray();

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
