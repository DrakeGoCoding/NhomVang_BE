const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const rfs = require('rotating-file-stream');
const morgan = require('morgan');
const mongoose = require('mongoose');

dotenv.config();
const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

const accessLogStream = rfs.createStream('access.log', {
	interval: '1d',
	path: path.join(__dirname, 'loggers')
});
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan('combined', { stream: accessLogStream }));

mongoose.connect(process.env.DB_CONNECTION, (error) => {
	if (error) {
		throw new Error("Database connection failed.");
	}
	console.log("Database connected.");
})

const port = process.env.PORT || 8080;
app.listen(port, () => { console.log("Listening to PORT:" + port) });

module.exports = app;