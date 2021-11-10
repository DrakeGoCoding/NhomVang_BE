const error = require('../constants/error');

const handleGlobalError = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';
	err.message = err.message || error[process.env.LANGUAGE].SYSTEM_ERROR;

	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack
	});
}

module.exports = {
	handleGlobalError
}
