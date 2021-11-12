const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

process.on("uncaughtException", err => {
	console.log("Uncaught Exception! Shutting down now...");
	console.log(err.name, err.message);
	process.exit(1);
})

const app = require('./app');

// Connect database
const database = process.env.DB_CONNECTION.replace('<PASSWORD>', process.env.DB_PASSWORD);
mongoose.connect(database, (error) => {
	if (error) {
		throw new Error("Database connection failed.");
	}
	console.log("Database connected.");
});

// Start server
const port = process.env.PORT || 8080;
const server = app.listen(port, () => { console.log("Listening to PORT:" + port) });

process.on("unhandledRejection", err => {
	console.log("Unhandled Rejection! Shutting down now...");
	console.log(err.name, err.message);
	server.close(() => {
		process.exit(1);
	});
});
