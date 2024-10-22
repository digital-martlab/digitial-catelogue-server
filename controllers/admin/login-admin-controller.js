const { StatusCodes } = require("http-status-codes");
const ErrorCreator = require("../../config/error-creator-config");
const catchAsyncHandler = require("../../middlewares/catch-async-handler-middleware");
const sqlQueryRunner = require("../../config/database");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const constantVariables = require("../../config/constant-variables");
const createResponse = require("../../config/create-response-config");

module.exports = catchAsyncHandler(async (req, res, next) => {
    const { store_id, password } = req.body;

    if (!store_id || !password)
        next(new ErrorCreator(StatusCodes.BAD_REQUEST, "Store_id and password is required"));

    const sql = `SELECT * FROM stores WHERE store_id = ?`;
    const data = await sqlQueryRunner(sql, [store_id]);

    if (data?.length === 0)
        next(new ErrorCreator(StatusCodes.OK, "store not exist with this store id."))

    const store = data[0];
    const isVerified = bcrypt.compare(password, store?.password);

    if (!isVerified)
        next(new ErrorCreator(StatusCodes.BAD_REQUEST, "store_id or password is wrong."));

    delete store?.password;
    const token = await jwt.sign(store, constantVariables.JWT_SECRET_KEY);
    return createResponse(res, StatusCodes.OK, "User logged in successfully.", { token });
})