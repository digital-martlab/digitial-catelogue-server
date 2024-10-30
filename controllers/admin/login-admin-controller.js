const { StatusCodes } = require("http-status-codes");
const ErrorCreator = require("../../config/error-creator-config");
const catchAsyncHandler = require("../../middlewares/catch-async-handler-middleware");
const { sqlQueryRunner } = require("../../config/database");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const constantVariables = require("../../config/constant-variables");
const createResponse = require("../../config/create-response-config");

module.exports = catchAsyncHandler(async (req, res, next) => {
    const { store_id, password } = req.body;

    // Validate input
    if (!store_id || !password) {
        return next(new ErrorCreator(StatusCodes.BAD_REQUEST, "Store_id and password are required"));
    }

    // SQL query to fetch store details
    const sql = `SELECT s.*, t.theme_color, t.theme_mod 
                 FROM stores s 
                 JOIN theme t ON t.acc_id = s.acc_id 
                 WHERE store_id = ?`;

    // Execute SQL query
    const data = await sqlQueryRunner(sql, [store_id]);

    // Check if store exists
    if (data?.length === 0) {
        return next(new ErrorCreator(StatusCodes.NOT_FOUND, "Store does not exist with this store id."));
    }

    const store = data[0];
    console.log(store);

    if (!store?.is_active)
        next(new ErrorCreator(StatusCodes.BAD_GATEWAY, "You have been blocked by the administrator. Please contact them for further assistance."));

    // if ((new Date()) > (new Date(store?.plan_expires_in)))
    //     next(new ErrorCreator(StatusCodes.FORBIDDEN, "Your plan has expired. Please contact the administrator for assistance."));

    // // Verify password
    const isVerified = await bcrypt.compare(password, store?.password);
    if (!isVerified) {
        return next(new ErrorCreator(StatusCodes.BAD_REQUEST, "Store_id or password is wrong."));
    }

    // Remove password from store object
    delete store?.password;

    // Generate JWT token
    const token = await jwt.sign(store, constantVariables.JWT_SECRET_KEY);

    // Send response
    return createResponse(res, StatusCodes.OK, "User logged in successfully.", { token });
});
