const User = require('@models/user');
const { generateToken } = require('@utils/token');
const { responseUser } = require('@utils/responsor');
const AppError = require('@utils/appError');
const { WRONG_AUTH_INPUT } = require('@constants/error');

/**
 * Login an admin account
 * @param {String} username 
 * @param {String} password 
 */
const login = async (username, password) => {
	// check if
	// - username exists
	// - user is admin
	// - password is correct
	const user = await User.findOne({ username }).select('+hash');
	if (!user || user.role !== "admin" || !(await user.isCorrectPassword(password, user.hash))) {
		throw new AppError(401, "fail", WRONG_AUTH_INPUT);
	}

	const token = generateToken(user._id);
	return {
		statusCode: 200,
		data: { token, user: responseUser(user.toJSON()) }
	};
}

module.exports = {
	login
}
