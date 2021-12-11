const cartService = require("@services/cart.service");

const addItem = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { slug, quantity } = req.body;
        const { statusCode, data } = await cartService.addItem(userId, slug, quantity);
        res.status(statusCode).json(data);
    } catch (error) {
        next(error);
    }
};

const updateItem = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { slug, quantity } = req.body;
        const { statusCode, data } = await cartService.updateItem(userId, slug, quantity);
        res.status(statusCode).json(data);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addItem,
    updateItem
};
