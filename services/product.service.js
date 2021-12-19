const Product = require("@models/product");
const AppError = require("@utils/appError");
const { responseProduct } = require("@utils/responsor");
const { NOT_FOUND_PRODUCT } = require("@constants/error");

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
const getAllProducts = async (filter = {}, limit = 10, offset = 0) => {
    const query = {
        $and: [
            { name: { $regex: new RegExp(filter.name || "", "i") } },
            { supplier: { $regex: new RegExp(filter.supplier || "", "i") } },
            {
                $or: [
                    {
                        $and: [
                            { discountPrice: { $ne: 0 } },
                            { discountPrice: { $gte: filter.minPrice, $lte: filter.maxPrice } }
                        ]
                    },
                    {
                        $and: [
                            { discountPrice: { $eq: 0 } },
                            { listedPrice: { $gte: filter.minPrice, $lte: filter.maxPrice } }
                        ]
                    }
                ]
            }
        ]
    };
    if (typeof filter.hot === "boolean" && filter.hot) {
        query.$and.push({ isHot: filter.hot });
    }
    if (typeof filter.inSlider === "boolean" && filter.inSlider) {
        query.$and.push({ isInSlider: filter.inSlider });
    }

    const result = Product.collection.find(query).sort({ modifiedDate: -1 });

    const total = await result.count();
    const productList = await result.skip(offset).limit(limit).toArray();

    return {
        statusCode: 200,
        data: {
            productList: productList.map(product => responseProduct(product.toJSON())),
            total
        }
    };
};

/**
 * Get a product by slug
 * @param {String} slug
 * @DrakeGoCoding 12/02/2021
 */
const getProduct = async slug => {
    const product = await Product.findOne({ slug });
    if (!product) {
        throw new AppError(404, "fail", NOT_FOUND_PRODUCT);
    }

    return {
        statusCode: 200,
        data: { product: responseProduct(product.toJSON()) }
    };
};

module.exports = {
    getAllProducts,
    getProduct
};
