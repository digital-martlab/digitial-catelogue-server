const jwt = require('jsonwebtoken');
const constantVariables = require('../config/constant-variables');
const catchAsyncHandler = require('./catch-async-handler-middleware');
const ErrorCreator = require('../config/error-creator-config');
const { StatusCodes } = require('http-status-codes');
const { ROLES } = require('../config/roles-config');
const { sqlQueryRunner } = require('../config/database');

const verifyJWT = (allowedRoles) => catchAsyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return next(new ErrorCreator(StatusCodes.UNAUTHORIZED, "User is not authorized"));
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, constantVariables.JWT_SECRET_KEY, async (err, decoded) => {
        if (err) {
            return next(new ErrorCreator(StatusCodes.FORBIDDEN, "User is not authorized"));
        }

        req.user = decoded;

        if (!allowedRoles.includes(decoded?.role)) {
            return next(new ErrorCreator(StatusCodes.UNAUTHORIZED, "User does not have permission"));
        }

        // For Stores
        if (decoded?.role === ROLES.ADMIN) {
            const userExist = await sqlQueryRunner(`SELECT * FROM stores WHERE acc_id = ?`, [decoded?.acc_id]);
            if (userExist.length === 0)
                next(new ErrorCreator(StatusCodes.NOT_FOUND, "Store not found."));

            if (!userExist[0]?.is_active)
                next(new ErrorCreator(StatusCodes.BAD_GATEWAY, "You have been blocked by the administrator. Please contact them for further assistance."));

            if ((new Date()) > (new Date(userExist[0]?.plan_expires_in)))
                next(new ErrorCreator(StatusCodes.FORBIDDEN, "Your plan has expired. Please contact the administrator for assistance."));
            req.user = userExist[0];
        }

        next();
    });
});

module.exports = verifyJWT;
