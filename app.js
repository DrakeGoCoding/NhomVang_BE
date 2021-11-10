const express = require('express');
const cors = require('cors');
const path = require('path');
const rfs = require('rotating-file-stream');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const { handleGlobalError } = require('./middlewares/error.middleware');
const AppError = require('./utils/appError');
const error = require('./constants/error');

const LANGUAGE = process.env.LANGUAGE;

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

const accessLogStream = rfs.createStream('access.log', {
	interval: '1d',
	path: path.join(__dirname, 'loggers')
});
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan('combined', { stream: accessLogStream }));

app.use("*", (req, res, next) => {
	const err = new AppError(
		404,
		"fail",
		error[LANGUAGE].UNDEFINED_ROUTE
	);
	next(err, req, res, next);
});
app.use(handleGlobalError);

module.exports = app;