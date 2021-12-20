const authService = require("@services/auth.service");
const AppError = require("@utils/appError");
const { MISSING_AUTH_INPUT, MISSING_USER_INPUT } = require("@constants/error");
const { responseUser } = require("@utils/responsor");

const login = async (req, res, next) => {
    try {
        const user = req.body.user;
        if (!user) {
            throw new AppError(400, "fail", MISSING_AUTH_INPUT);
        }

        const { username, password } = user;
        if (!username || !password) {
            throw new AppError(400, "fail", MISSING_AUTH_INPUT);
        }

        const { statusCode, data } = await authService.login(username, password);
        res.status(statusCode).json(data);
    } catch (error) {
        next(error);
    }
};

const register = async (req, res, next) => {
    try {
        const user = req.body.user;
        if (!user) {
            throw new AppError(400, "fail", MISSING_USER_INPUT);
        }

        const { username, password } = user;
        if (!username || !password) {
            throw new AppError(400, "fail", MISSING_USER_INPUT);
        }

        const { statusCode, data } = await authService.register(username, password);
        res.status(statusCode).json(data);
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        let user = req.body.user;
        if (!user || !user.username) {
            throw new AppError(400, "fail", MISSING_USER_INPUT);
        }

        if (user.username !== req.user.username) {
            throw new AppError(403, "fail", FORBIDDEN);
        }

        user = Object.assign(user, {
            hash: undefined,
            salt: undefined,
            role: undefined,
            createdDate: undefined,
            modifiedDate: Date.now()
        });

        const { statusCode, data } = await authService.updateUser(user);
        res.status(statusCode).json(data);
    } catch (error) {
        next(error);
    }
};

const getCurrentUser = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(204).json({ user: null });
        } else {
            res.status(200).json({
                stripeKey: process.env.STRIPE_PUBLIC,
                user: responseUser(req.user)
            });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    login,
    register,
    updateUser,
    getCurrentUser
};
