const { StatusCodes } = require("http-status-codes");
const ErrorCreator = require("../../config/error-creator-config");
const catchAsyncHandler = require("../../middlewares/catch-async-handler-middleware");
const { sqlQueryRunner } = require("../../config/database");
const bcrypt = require("bcrypt");
const constantVariables = require("../../config/constant-variables");
const createResponse = require("../../config/create-response-config");

module.exports = catchAsyncHandler(async (req, res, next) => {
    const { current_password, new_password, confirm_new_password } = req.body;

    if (!current_password || !new_password || !confirm_new_password) {
        return next(new ErrorCreator(StatusCodes.BAD_REQUEST, "All fields are required."));
    }

    if (new_password !== confirm_new_password) {
        return next(new ErrorCreator(StatusCodes.BAD_REQUEST, "New & Confirm new password doesn't match."));
    }

    const sql = `SELECT * FROM stores WHERE acc_id = ?`;
    const data = await sqlQueryRunner(sql, [req?.user?.acc_id]);

    if (data.length === 0) {
        return next(new ErrorCreator(StatusCodes.BAD_REQUEST, "Store not found."));
    }

    const store = data[0];

    const isVerified = await bcrypt.compare(current_password, store?.password);
    if (!isVerified) {
        return next(new ErrorCreator(StatusCodes.BAD_REQUEST, "Current password is incorrect."));
    }

    const salt = await bcrypt.genSalt(constantVariables.SALT);
    const hashPassword = await bcrypt.hash(new_password.trim(), salt);

    const updateSql = `UPDATE stores SET password = ? WHERE acc_id = ?`;
    await sqlQueryRunner(updateSql, [hashPassword, req?.user?.acc_id]);

    return createResponse(res, StatusCodes.OK, "Password updated successfully.");
});
