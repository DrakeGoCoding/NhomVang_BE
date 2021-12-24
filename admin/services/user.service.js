const bcrypt = require("bcrypt");
const User = require("@models/user");
const { responseUser } = require("@utils/responsor");
const AppError = require("@utils/appError");
const { NOT_FOUND_USER, FOUND_USER, FORBIDDEN } = require("@constants/error");

/**
 * Get all users data
 * @param {{
 * 		regex: String
 * 		role: String
 * }} filter
 * @param {Number} limit
 * @param {Number} offset
 * @DrakeGoCoding 11/22/2021
 */
const getAllUsers = async (filter = {}, limit = 10, offset = 0) => {
    const { role, regex } = filter;
    const roleRegex = new RegExp(role || "", "i");
    const globalRegex = new RegExp(regex || "", "i");
    const query = {
        $and: [
            { role: { $regex: roleRegex } },
            {
                $or: [
                    { username: { $regex: globalRegex } },
                    { displayname: { $regex: globalRegex } },
                    { email: { $regex: globalRegex } },
                    { phonenumber: { $regex: globalRegex } }
                ]
            }
        ]
    };

    const result = await User.collection.find(query).sort({ modifiedDate: -1 });
    const total = await result.count();
    const userList = await result.skip(offset).limit(limit).toArray();

    if (!total || !userList || userList.length === 0) {
        return {
            statusCode: 200,
            data: {
                userList: [],
                total: 0
            }
        };
    }

    return {
        statusCode: 200,
        data: {
            userList: userList.map(user => responseUser(user)),
            total
        }
    };
};

/**
 * Create a new admin user
 * @param {User} user
 * @DrakeGoCoding 11/22/2021
 */
const createUser = async user => {
    // check if username is registered
    const foundUser = await User.findOne({ username: user.username });
    if (foundUser) {
        throw new AppError(400, "fail", FOUND_USER);
    }

    // generate salt then hash password
    const saltRounds = Number.parseInt(process.env.SALT_ROUNDS);
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(user.password, salt);

    // save user
    const newUser = new User({ ...user, hash, salt, role: "admin" });
    await newUser.save();

    return {
        statusCode: 201,
        data: { user: responseUser(newUser.toJSON()) }
    };
};

/**
 * Update an admin user by username
 * @param {User} user
 * @DrakeGoCoding 11/22/2021
 */
const updateUser = async user => {
    const { username, password } = user;
    let hash, salt;

    if (password) {
        // generate salt then hash password
        const saltRounds = Number.parseInt(process.env.SALT_ROUNDS);
        salt = bcrypt.genSaltSync(saltRounds);
        hash = bcrypt.hashSync(password, salt);
    }

    const updatedUser = await User.findOneAndUpdate({ username }, { ...user, hash, salt }, { new: true });
    if (!updatedUser) {
        throw new AppError(404, "fail", NOT_FOUND_USER);
    }

    return {
        statusCode: 200,
        data: { user: responseUser(updatedUser.toJSON()) }
    };
};

/**
 * Delete an account by username
 * @param {String} username
 * @DrakeGoCoding 11/22/2021
 */
const deleteUser = async username => {
    if (username === "admin") {
        throw new AppError(403, "fail", FORBIDDEN);
    }

    const user = await User.findOneAndDelete({ username }, { new: true });
    if (!user) {
        throw new AppError(404, "fail", NOT_FOUND_USER);
    }

    return {
        statusCode: 200,
        data: {
            username: user.username
        }
    };
};

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
};
