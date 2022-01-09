const { diff } = require("deep-diff");
const Product = require("@models/product");
const AppError = require("@utils/appError");
const { responseProduct } = require("@utils/responsor");
const { NOT_FOUND_PRODUCT } = require("@constants/error");

/**
 * Create a new product
 * @param {String} creator
 * @param {Product} product
 * @DrakeGoCoding 12/01/2021
 */
const createProduct = async (creator, product) => {
    const createdProduct = await Product.create({
        ...product,
        logs: [
            {
                user: creator,
                action: "create"
            }
        ]
    });
    return {
        statusCode: 201,
        data: { product: responseProduct(createdProduct.toJSON()) }
    };
};

/**
 * Update a product
 * @param {String} updater
 * @param {String} slug
 * @param {Product} product
 * @DrakeGoCoding 12/01/2021
 */
const updateProduct = async (updater, slug, product) => {
    let updatedProduct = await Product.findOneAndUpdate({ slug }, product);
    if (!updatedProduct) {
        throw new AppError(404, "fail", NOT_FOUND_PRODUCT);
    }

    const lhs = Object.assign(updatedProduct.toJSON(), {
        _id: undefined,
        __v: undefined,
        slug: undefined,
				description: undefined,
        createdDate: undefined,
        modifiedDate: undefined,
        logs: undefined
    });
    const rhs = { ...product, _id: undefined, __v: undefined, description: undefined };
    const diffs = diff(lhs, rhs);
    if (diffs) {
        updatedProduct.logs.push({
            user: updater,
            action: "update",
            details: diffs.map(diff => ({
                field: diff.path[0],
                prevValue: lhs[diff.path[0]],
                nextValue: rhs[diff.path[0]]
            }))
        });
    }

    updatedProduct = await updatedProduct.save();

    return {
        statusCode: 200,
        data: { product: responseProduct(updatedProduct.toJSON()) }
    };
};

/**
 * Delete a product
 * @param {String} slug
 * @DrakeGoCoding 12/01/2021
 */
const deleteProduct = async slug => {
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
};

module.exports = {
    createProduct,
    updateProduct,
    deleteProduct
};
