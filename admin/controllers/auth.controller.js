const authService = require('@admin/services/auth.service');
const AppError = require('@utils/appError');
const { MISSING_AUTH_INPUT } = require('@constants/error');
const { responseUser } = require('../../utils/responsor');

const login = async (req, res, next) => {
	try {
		const { username, password } = req.body.user;

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

const getCurrentUser = async (req, res, next) => {
	try {
		if (!req.user) {
			res.status(204).json({ user: null });
		} else {
			res.status(200).json({ user: responseUser(req.user) });
		}
	} catch (error) {
		next(error);
	}
}

module.exports = {
	login,
	getCurrentUser
}
