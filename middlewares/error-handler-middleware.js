const { StatusCodes } = require('http-status-codes');

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({ statusCode, message });
};

module.exports = errorHandler;