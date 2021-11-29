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
	const query = User
		.collection
		.find(filter)
		.sort({ modifiedDate: -1 });

	const total = await query.count();
	const userList = await query.skip(offset).limit(limit).toArray();

	if (!total || !userList || userList.length === 0) {
		return {
			statusCode: 204,
			data: {
				userList: [],
				total: 0,
				totalPage: 0
			}
		};
	}

	return {
		statusCode: 200,
		data: { 
			userList: userList.map(user => responseUser(user)),
			total,
			totalPage: Math.ceil(total / limit)
		}
	};
}

/**
 * Create a new admin user
 * @param {String} username 
 * @param {String} password 
 * @DrakeGoCoding 11/22/2021
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
 * @param {User} user 
 * @DrakeGoCoding 11/22/2021
 */
const updateUser = async (user) => {
	const { username, password } = user;
	let hash, salt;

	if (password) {
		// generate salt then hash password
		const saltRounds = Number.parseInt(process.env.SALT_ROUNDS);
		salt = bcrypt.genSaltSync(saltRounds);
		hash = bcrypt.hashSync(password, salt);
	}

	const updatedUser = await User.findOneAndUpdate(
		{ username },
		{ ...user, hash, salt },
		{ new: true }
	);
	if (!updatedUser) {
		throw new AppError(404, "fail", NOT_FOUND_USER);
	}

	return {
		statusCode: 200,
		data: { user: responseUser(updatedUser.toJSON()) }
	};
}

/**
 * Delete an account by username
 * @param {String} username 
 * @DrakeGoCoding 11/22/2021
 */
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
