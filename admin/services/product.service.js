const Product = require('@models/product');
const AppError = require('@utils/appError');
const { responseProduct } = require('@utils/responsor');
const { NOT_FOUND_PRODUCT } = require('@constants/error');

/**
 * Create a new product
 * @param {Product} product 
 * @DrakeGoCoding 12/01/2021
 */
const createProduct = async (product) => {
	const createdProduct = await Product.create(product);
	return {
		statusCode: 201,
		data: { product: responseProduct(createdProduct.toJSON()) }
	};
}

/**
 * Update a product
 * @param {Product} product 
 * @DrakeGoCoding 12/01/2021
 */
const updateProduct = async (slug, product) => {
	const updatedProduct = await Product.findOneAndUpdate({ slug }, product, { new: true });
	if (!updatedProduct) {
		throw new AppError(404, "fail", NOT_FOUND_PRODUCT);
	}

	return {
		statusCode: 200,
		data: { product: responseProduct(updatedProduct.toJSON()) }
	};
}

/**
 * Delete a product
 * @param {String} slug 
 * @DrakeGoCoding 12/01/2021
 */
const deleteProduct = async (slug) => {
	const product = await Product.findOneAndDelete({ slug }, { new: true });
	if (!product) {
		throw new AppError(404, "fail", NOT_FOUND_PRODUCT);
	}

	return {
		statusCode: 200,
		data: {
			slug: product.slug
		}
	};
}

module.exports = {
	createProduct,
	updateProduct,
	deleteProduct
}
