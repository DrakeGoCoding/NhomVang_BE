const { SYSTEM_ERROR } = require("@constants/error");

const handleGlobalError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    err.message = err.message || SYSTEM_ERROR;

    console.log(err);

    const data = Object.assign(
        {},
        {
            status: err.status,
            message: err.message
        },
        process.env.NODE_ENV === "production" ? {} : { stack: err.stack }
    );

    res.status(err.statusCode).json(data);
};

module.exports = {
    handleGlobalError
};
