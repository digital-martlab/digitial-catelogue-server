const { StatusCodes } = require("http-status-codes");
const ErrorCreator = require("../../config/error-creator-config");
const catchAsyncHandler = require("../../middlewares/catch-async-handler-middleware");
const createResponse = require("../../config/create-response-config");
const { sqlQueryRunner } = require("../../config/database");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const constantVariables = require("../../config/constant-variables");

module.exports = catchAsyncHandler(async (req, res, next) => {
    const { user_name, password } = req.body;
    if (!user_name || !password) {
        return next(new ErrorCreator(StatusCodes.BAD_REQUEST, "user_name and password must be required."));
    }

    const sql = `SELECT * FROM admins WHERE user_name = ?`;
    const data = await sqlQueryRunner(sql, [user_name]);
    const admin = data[0];
    if (!admin) {
        return next(new ErrorCreator(StatusCodes.BAD_REQUEST, "User not found with this username."));
    }

    const isVerified = await bcrypt.compare(password, admin.password);
    if (!isVerified) {
        return next(new ErrorCreator(StatusCodes.BAD_REQUEST, "Incorrect username or password."));
    }

    delete admin.password;
    const token = jwt.sign(admin, constantVariables.JWT_SECRET_KEY, { expiresIn: '48h' });

    return createResponse(res, StatusCodes.OK, "User logged in successfully.", { token });
});
