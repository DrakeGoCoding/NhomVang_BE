const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { responseUser } = require('../utils/responsor');

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
	const saltRounds = Number.parseInt(process.env.SALT_ROUNDS);
	const salt = bcrypt.genSaltSync(saltRounds);
	const hash = bcrypt.hashSync(password, salt);
	const user = new User({ username, hash, salt });
	await user.save();

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
