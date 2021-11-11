const authService = require('../services/auth.service');
const User = require('../models/user');
const AppError = require('../utils/appError');
const { 
	MISSING_AUTH_INPUT, 
	WRONG_AUTH_INPUT, 
	FOUND_USER 
} = require('../constants/error');

const login = async (req, res, next) => {
	try {
		const { username, password } = await authService.login(username, password);

		// TODO: check if username and password are filled
		if (!username || !password) {
			throw new AppError(400, "fail", MISSING_AUTH_INPUT);
		}

		// TODO: check if username exists and password is correct
		const user = await User.findOne({ username }).select('+hash');
		if (!user || !(await user.isCorrectPassword(password, user.hash))) {
			throw new AppError(401, "fail", WRONG_AUTH_INPUT);
		}

		const { statusCode, data } = await authService.login(username, password);
		res.status(statusCode).json(data);
	} catch (error) {
		next(error);
	}
}

const register = async (req, res, next) => {
	try {
		const { username, password } = req.body;

		// TODO: check if username and password are filled
		if (!username || !password) {
			throw new AppError(400, "fail", MISSING_AUTH_INPUT);
		}

		// TODO: check if username is registered
		const user = await User.findOne({ username });
		if (user) {
			throw new AppError(400, "fail", FOUND_USER);
		}

		const { statusCode, data } = await authService.register(username, password);
		res.status(statusCode).json(data);
	} catch (error) {
		next(error);
	}
}

module.exports = {
	login,
	register
}
