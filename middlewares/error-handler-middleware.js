const { StatusCodes } = require('http-status-codes');

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    err.message = err.message === "File too large" ? "Image size must be less than 500kb" : err.message;
    const message = err.message || 'Internal Server Error';
    console.log(err);
    return res.status(statusCode).json({ statusCode, message });
};

module.exports = errorHandler;