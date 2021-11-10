const AppError = require("../utils/appError");
const error = require("../constants/error");
const lang = process.env.LANGUAGE;

const authenticate = async (req, res, next) => {

}

const restrictTo = (...roles) => {
	if (!roles.includes(req.user.role)) {
		const err = new AppError(
			403,
			"fail",
			error[lang].FORBIDDEN
		);
		next(err, req, res, next);
	}
	next();
}

module.exports = {
	authenticate,
	restrictTo
}
