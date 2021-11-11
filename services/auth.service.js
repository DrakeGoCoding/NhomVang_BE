const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { responseUser } = require('../utils/responsor');
const AppError = require('../utils/appError');
const { WRONG_AUTH_INPUT, FOUND_USER } = require('../constants/error');

/**
 * Generate a token from a record id
 * @param {String} id Record ID
 * @returns {String} JsonWebToken String
 * @DrakeGoCoding 11/10/2021
 */
const generateToken = id => {
	return jwt.sign(
		{ id },
		process.env.JWT_SECRET,
		{ expiresIn: process.env.JWT_EXPIRES_IN }
	);
}

/**
 * Login a registered account
 * @param {String} username
 * @param {String} password
 * @DrakeGoCoding 11/11/2021
 */
const login = async (username, password) => {
	// check if username exists and password is correct
	const user = await User.findOne({ username }).select('+hash');
	if (!user || !(await user.isCorrectPassword(password, user.hash))) {
		throw new AppError(401, "fail", WRONG_AUTH_INPUT);
	}

	// generate a new token
	const token = generateToken(user._id);
	return {
		statusCode: 200,
		data: { token, user: responseUser(user.toJSON()) }
	};
}

/**
 * Register a new user account (role="user")
 * @param {String} username 
 * @param {String} password
 * @DrakeGoCoding 11/10/2021
 */
const register = async (username, password) => {
	// check if username is registered
	const foundUser = await User.findOne({ username });
	if (foundUser) {
		throw new AppError(400, "fail", FOUND_USER);
	}

	// generate salt then hash password
	const saltRounds = Number.parseInt(process.env.SALT_ROUNDS);
	const salt = bcrypt.genSaltSync(saltRounds);
	const hash = bcrypt.hashSync(password, salt);

	// save user
	const user = new User({ username, hash, salt });
	await user.save();

	// generate a new token
	const token = generateToken(user._id);
	return {
		statusCode: 201,
		data: { token, user: responseUser(user.toJSON()) }
	};
}

module.exports = {
	login,
	register
}
