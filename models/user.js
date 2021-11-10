const mongoose = require('mongoose');
const { USER } = require('../constants/role');

const userSchema = mongoose.Schema({
	username: { type: String, unique: true, required: true },
	hash: { type: String, required: true },
	salt: { type: String, required: true },
	role: { type: String, required: true, default: USER },
	displayname: { type: String },
	photourl: { type: String, default: "" },
	gender: { type: String, default: "" },
	dob: { type: Date, default: Date.now },
	email: { type: String, default: "" },
	phonenumber: { type: String, default: "" },
	address: {
		city: { type: String, default: "" },
		district: { type: String, default: "" },
		detail: { type: String, default: "" }
	}
});

userSchema.pre('save', function (next) {
	if (!this.displayname) {
		this.displayname = this.username;
	}
	next();
})

const User = mongoose.model('User', userSchema);
module.exports = User;