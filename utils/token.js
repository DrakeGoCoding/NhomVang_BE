const jwt = require('jsonwebtoken');

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

module.exports = {
	generateToken
}
