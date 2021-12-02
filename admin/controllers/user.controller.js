const userService = require('@admin/services/user.service');
const AppError = require('@utils/appError');
const { MISSING_USER_INPUT } = require('@constants/error');

const getAllUsers = async (req, res, next) => {
	try {
		const { limit, offset, ...filter } = req.query;
		const { statusCode, data } = await userService.getAllUsers(filter, limit, offset);
		res.status(statusCode).json(data);
	} catch (error) {
		next(error);
	}
}

const createUser = async (req, res, next) => {
	try {
		let user = req.body.user;
		if (!user || !user.username || !user.password) {
			throw new AppError(400, "fail", MISSING_USER_INPUT);
		}

		user = Object.assign(user, {
			hash: undefined,
			salt: undefined,
			role: undefined,
			createdDate: undefined,
			modifiedDate: Date.now(),
		});

		const { statusCode, data } = await userService.createUser(user);
		res.status(statusCode).json(data);
	} catch (error) {
		next(error);
	}
}

const updateUser = async (req, res, next) => {
	try {
		let user = req.body.user;
		if (!user || !user.username) {
			throw new AppError(400, "fail", MISSING_USER_INPUT);
		}

		user = Object.assign(req.body, {
			hash: undefined,
			salt: undefined,
			role: undefined,
			createdDate: undefined,
			modifiedDate: Date.now(),
		});

		const { statusCode, data } = await userService.updateUser(user);
		res.status(statusCode).json(data);
	} catch (error) {
		next(error);
	}
}

const deleteUser = async (req, res, next) => {
	try {
		const { username } = req.query;
		if (!username) {
			throw new AppError(400, "fail", MISSING_USER_INPUT);
		}

		const { statusCode, data } = await userService.deleteUser(username);
		res.status(statusCode).json(data);
	} catch (error) {
		next(error);
	}
}

module.exports = {
	getAllUsers,
	createUser,
	updateUser,
	deleteUser
}
