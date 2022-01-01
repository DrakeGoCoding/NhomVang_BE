const cartService = require("@services/cart.service");
const { isValidId } = require("@utils/mongoose");
const AppError = require("@utils/appError");
const {
    INVALID_ID,
    INVALID_CART_ITEM_QUANTITY,
    MISSING_CART_ITEM_ID,
    MISSING_CART_ITEM_QUANTITY
} = require("@constants/error");

const getCart = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { statusCode, data } = await cartService.getCart(userId);
        res.status(statusCode).json(data);
    } catch (error) {
        next(error);
    }
};

const addItem = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { _id, quantity } = req.body.item;

        if (!_id) {
            throw new AppError(400, "fail", MISSING_CART_ITEM_ID);
        }

        if (!isValidId(_id)) {
            throw new AppError(400, "fail", INVALID_ID);
        }

        if (quantity == null) {
            throw new AppError(400, "fail", MISSING_CART_ITEM_QUANTITY);
        }

        if (!(Number.isInteger(quantity) && quantity > 0)) {
            throw new AppError(400, "fail", INVALID_CART_ITEM_QUANTITY);
        }

        const { statusCode, data } = await cartService.addItem(userId, _id, quantity);
        res.status(statusCode).json(data);
    } catch (error) {
        next(error);
    }
};

const removeItem = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const _id = req.body._id;

        if (!_id) {
            throw new AppError(400, "fail", MISSING_CART_ITEM_ID);
        }

        if (!isValidId(_id)) {
            throw new AppError(400, "fail", INVALID_ID);
        }

        const { statusCode, data } = await cartService.removeItem(userId, _id);
        res.status(statusCode).json(data);
    } catch (error) {
        next(error);
    }
};

const updateItem = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { _id, quantity } = req.body.item;

        if (!_id) {
            throw new AppError(400, "fail", MISSING_CART_ITEM_ID);
        }

        if (!isValidId(_id)) {
            throw new AppError(400, "fail", INVALID_ID);
        }

        if (quantity == null) {
            throw new AppError(400, "fail", MISSING_CART_ITEM_QUANTITY);
        }

        if (!(Number.isInteger(quantity) && quantity > 0)) {
            throw new AppError(400, "fail", INVALID_CART_ITEM_QUANTITY);
        }

        const { statusCode, data } = await cartService.updateItem(userId, _id, quantity);
        res.status(statusCode).json(data);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCart,
    addItem,
    removeItem,
    updateItem
};
