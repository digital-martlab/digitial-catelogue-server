const { StatusCodes } = require("http-status-codes");
const ErrorCreator = require("../config/error-creator-config");

const allowedOrigins = ['https://cataloguewala.com'];

module.exports = function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
    } else {
        callback(new ErrorCreator(StatusCodes.FORBIDDEN, 'Not allowed by CORS'));
    }
}