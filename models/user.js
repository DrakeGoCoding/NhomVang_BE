const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	username: { type: String, unique: true, required: true },
	hash: { type: String, required: true },
	salt: { type: String, required: true },
	role: { type: String, required: true },
	displayName: { type: String },
	photoUrl: { type: String },
	gender: { type: String },
	dob: { type: Date },
	email: { type: String, unique: true },
	phoneNumber: { type: String, unique: true },
	address: {
		city: { type: String },
		district: { type: String },
		ward: { type: String },
		detail: { type: String }
	}
});

userSchema.pre('save', function (next) {
	if (!this.displayname) {
		this.displayName = this.username;
	}
	next();
})

const User = mongoose.model('User', userSchema);
module.exports = User;