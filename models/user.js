const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { INVALID_PHOTOURL, INVALID_DOB, INVALID_EMAIL, INVALID_PHONENUMBER } = require("@constants/error");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        immutable: true
    },
    hash: { type: String, required: true, select: false },
    salt: { type: String, required: true, select: false },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
		immutable: true
    },
    displayname: {
        type: String,
        default: function () {
            return this.username;
        },
        trim: true
    },
    photourl: {
        type: String,
        validate: [validator.isURL, INVALID_PHOTOURL]
    },
    gender: {
        type: String,
        enum: ["male", "female"]
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
    },
	isSubcribing: {
		type: Boolean,
		default: true
	},
    createdDate: { type: Date, default: Date.now, immutable: true },
    modifiedDate: { type: Date, default: Date.now }
});

userSchema.pre("save", function (next) {
    next();
});

userSchema.pre(["update", "updateOne", "updateMany", "findOneAndUpdate", "findByIdAndUpdate"], async function (next) {
    this.modifiedDate = Date.now();
    next();
});

userSchema.methods.isCorrectPassword = async (typedPassword, hashPassword) => {
    return await bcrypt.compare(typedPassword, hashPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
