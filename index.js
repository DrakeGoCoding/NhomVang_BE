const dotenv = require('dotenv');
dotenv.config();

const express = require('express');

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const cors = require('cors');
app.use(cors());

const rfs = require('rotating-file-stream');
const path = require('path');
const accessLogStream = rfs.createStream('access.log', {
	interval: '1d',
	path: path.join(__dirname, 'loggers')
});
const morgan = require('morgan');
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan('combined', { stream: accessLogStream }));

const mongoose = require('mongoose');
mongoose.connect(process.env.DB_CONNECTION, (error) => {
	if (error) {
		throw new Error("Database connection failed.");
	}
	console.log("Database connected.");
})

const port = process.env.PORT || 8080;
app.listen(port, () => { console.log("Listening to PORT:" + port) });

module.exports = app;