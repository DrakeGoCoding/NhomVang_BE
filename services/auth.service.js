const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AppError = require('../utils/appError');

const errorPackage = require('../constants/error');
const { responseUser } = require('../utils/responsor');
const error = errorPackage[process.env.LANGUAGE];

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
	return {
		statusCode: 200,
		data: null
	}
}

/**
 * Register a new user account (role="user")
 * @param {String} username 
 * @param {String} password
 * @DrakeGoCoding 11/10/2021
 */
const register = async (username, password) => {
	const foundUser = await User.findOne({ username });
	if (foundUser) {
		throw new AppError(400, "fail", error.FOUND_USER);
	}

	const salt = bcrypt.genSaltSync(process.env.SALT_ROUNDS);
	const hash = bcrypt.hashSync(password, salt);
	const newUser = new User({ username, hash, salt });
	await newUser.save();

	const token = generateToken(newUser._id);
	return {
		statusCode: 201,
		data: { token, user: responseUser(newUser) }
	}
}

module.exports = {
	login,
	register
}
