const jwt = require('jsonwebtoken');
const constantVariables = require('../config/constant-variables');
const catchAsyncHandler = require('./catch-async-handler-middleware');
const ErrorCreator = require('../config/error-creator-config');
const { StatusCodes } = require('http-status-codes');

const verifyJWT = (allowedRoles) => catchAsyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return next(new ErrorCreator(StatusCodes.UNAUTHORIZED, "User is not authorized"));
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, constantVariables.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return next(new ErrorCreator(StatusCodes.FORBIDDEN, "User is not authorized"));
        }

        req.user = decoded;

        if (!allowedRoles.includes(decoded?.role)) {
            return next(new ErrorCreator(StatusCodes.FORBIDDEN, "User does not have permission"));
        }

        next();
    });
});

module.exports = verifyJWT;
