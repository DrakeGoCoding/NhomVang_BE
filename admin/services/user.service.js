const bcrypt = require('bcrypt');
const User = require('@models/user');
const { responseUser } = require('@utils/responsor');
const AppError = require('@utils/appError');
const { NOT_FOUND_USER, FOUND_USER } = require('@constants/error');

/**
 * Get all users data
 * @param {{
 * 		username: String,
 * 		displayname: String,
 * 		email: String,
 * 		phonenumber: String,
 * 		role: String
 * }} filter
 * @param {Number} limit 
 * @param {Number} offset
 * @DrakeGoCoding 11/22/2021
 */
const getAllUsers = async (filter = {}, limit = 20, offset = 0) => {
	const userList = await User
		.find(filter)
		.skip(offset)
		.limit(limit);

	return {
		statusCode: newsList.length > 0 ? 200 : 204,
		data: { userList: [] || userList.map(user => responseUser(user.toJSON())) }
	};
}

/**
 * Create a new admin user
 * @param {String} username 
 * @param {String} password 
 * @returns 
 */
const createUser = async (username, password) => {
	// check if username is registered
	const foundUser = await User.findOne({ username });
	if (foundUser) {
		throw new AppError(400, "fail", FOUND_USER)
	}

	// generate salt then hash password
	const saltRounds = Number.parseInt(process.env.SALT_ROUNDS);
	const salt = bcrypt.genSaltSync(saltRounds);
	const hash = bcrypt.hashSync(password, salt);

	// save user
	const user = new User({ username, hash, salt, role: "admin" });
	await user.save();

	return {
		statusCode: 201,
		data: { user: responseUser(user.toJSON()) }
	};
}

/**
 * Update an admin user by username
 * @param {String} username 
 * @param {User} user 
 * @returns 
 */
const updateUser = async (username, user) => {
	const updatedUser = await User.findOneAndUpdate({ username }, user, { new: true });
	if (!updatedUser) {
		throw new AppError(404, "fail", NOT_FOUND_USER);
	}

	return {
		statusCode: 200,
		data: { user: responseUser(updatedUser.toJSON()) }
	};
}

const deleteUser = async (username) => {
	const user = await User.findOneAndDelete({ username }, { new: true });
	if (!user) {
		throw new AppError(404, "fail", NOT_FOUND_USER);
	}

	return {
		statusCode: 204,
		data: null
	};
}

module.exports = {
	getAllUsers,
	createUser,
	updateUser,
	deleteUser
}
