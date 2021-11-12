const authService = require('@services/auth.service');
const AppError = require('@utils/appError');
const { MISSING_AUTH_INPUT } = require('@constants/error');

const login = async (req, res, next) => {
	try {
		const { username, password } = req.body;

		// check if username and password are filled
		if (!username || !password) {
			throw new AppError(400, "fail", MISSING_AUTH_INPUT);
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

		// check if username and password are filled
		if (!username || !password) {
			throw new AppError(400, "fail", MISSING_AUTH_INPUT);
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
