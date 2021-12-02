const productService = require('@admin/services/product.service');
const AppError = require('@utils/appError');
const { MISSING_PRODUCT_INPUT, UNDEFINED_ROUTE } = require('@constants/error');

const createProduct = async (req, res, next) => {
	try {
		let product = req.body.product;
		if (!product) {
			throw new AppError(400, "fail", MISSING_PRODUCT_INPUT);
		}

		const { name, listedPrice, supplier, thumbnail } = product;
		if (!name || !listedPrice || !supplier || !thumbnail) {
			throw new AppError(400, "fail", MISSING_PRODUCT_INPUT);
		}

		product = Object.assign(product, {
			slug: undefined,
			createdDate: undefined,
			modifiedDate: Date.now()
		});

		const { statusCode, data } = await productService.createProduct(slug, product);
		res.status(statusCode).json(data);
	} catch (error) {
		next(error);
	}
}

const updateProduct = async (req, res, next) => {
	try {
		const { slug } = req.params;
		if (!slug) {
			throw new AppError(400, "fail", UNDEFINED_ROUTE);
		}

		let product = req.body.product;
		if (!product) {
			throw new AppError(400, "fail", MISSING_PRODUCT_INPUT);
		}

		const { name, listedPrice, supplier, thumbnail } = product;
		if (!name || !listedPrice || !supplier || !thumbnail) {
			throw new AppError(400, "fail", MISSING_PRODUCT_INPUT);
		}

		product = Object.assign(product, {
			slug: undefined,
			createdDate: undefined,
			modifiedDate: Date.now()
		});

		const { statusCode, data } = await productService.updateProduct(slug, product);
		res.status(statusCode).json(data);
	} catch (error) {
		next(error);
	}
}

const deleteProduct = async (req, res, next) => {
	try {
		const slug = req.params.slug;
		if (!slug) {
			throw new AppError(400, "fail", UNDEFINED_ROUTE);
		}

		const { statusCode, data } = await productService.deleteProduct(slug);
		res.status(statusCode).json(data);
	} catch (error) {
		next(error);
	}
}

module.exports = {
	createProduct,
	updateProduct,
	deleteProduct
}
