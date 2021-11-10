const authService = require('../services/auth.service');

const login = async (req, res, next) => {
	try {
		const { username, password } = await authService.login(username, password);

		// TODO: check if username and password are filled

		// TODO: check if username exists and password is correct

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
