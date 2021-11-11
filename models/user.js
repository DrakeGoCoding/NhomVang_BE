const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const { INVALID_PHOTOURL, INVALID_DOB, INVALID_EMAIL, INVALID_PHONENUMBER } = require('../constants/error');

const userSchema = mongoose.Schema({
	username: { type: String, unique: true, required: true },
	hash: { type: String, required: true, select: false },
	salt: { type: String, required: true, select: false },
	role: {
		type: String,
		enum: ["admin", "user"],
		default: "user"
	},
	displayname: {
		type: String,
		default: () => this.username
	},
	photourl: { 
		type: String,
		validate: [validator.isURL, INVALID_PHOTOURL]
	},
	gender: {
		type: String,
		enum: ["male", "female"],
	},
	dob: { 
		type: Date,
		validate: [validator.isDate, INVALID_DOB]
	},
	email: {
		type: String,
		validate: [validator.isEmail, INVALID_EMAIL]
	},
	phonenumber: { 
		type: String,
		validate: [validator.isMobilePhone, INVALID_PHONENUMBER]
	},
	address: {
		city: { type: String },
		district: { type: String },
		detail: { type: String }
	}
});

userSchema.pre('save', function (next) {
	next();
});

userSchema.methods.isCorrectPassword = async (typedPassword, hashPassword) => {
	return await bcrypt.compare(typedPassword, hashPassword);
}

const User = mongoose.model('User', userSchema);
module.exports = User;