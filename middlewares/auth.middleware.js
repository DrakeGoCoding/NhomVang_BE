const AppError = require("@utils/appError");
const { FORBIDDEN } = require("@constants/error");

const authenticate = async (req, res, next) => {

}

const restrictTo = (...roles) => {
	if (!roles.includes(req.user.role)) {
		const err = new AppError(403, "fail", FORBIDDEN);
		next(err, req, res, next);
	}
	next();
}

module.exports = {
	authenticate,
	restrictTo
}
