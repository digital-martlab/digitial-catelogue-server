const { StatusCodes } = require("http-status-codes");
const ErrorCreator = require("../../config/error-creator-config");
const catchAsyncHandler = require("../../middlewares/catch-async-handler-middleware");
const createResponse = require("../../config/create-response-config");
const sqlQueryRunner = require("../../config/database");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const constantVariables = require("../../config/constant-variables");

module.exports = catchAsyncHandler(async (req, res, next) => {
    const { user_name, password } = req.body;

    // Check if both user_name and password are provided
    if (!user_name || !password) {
        return next(new ErrorCreator(StatusCodes.BAD_REQUEST, "user_name and password must be required."));
    }

    // Query the database for the user by user_name
    const sql = `SELECT * FROM admins WHERE user_name = ?`;
    const data = await sqlQueryRunner(sql, [user_name]);

    // Check if the user exists
    const admin = data[0];
    if (!admin) {
        return next(new ErrorCreator(StatusCodes.BAD_REQUEST, "User not found with this username."));
    }

    // Compare the provided password with the stored hashed password
    const isVerified = await bcrypt.compare(password, admin.password);
    if (!isVerified) {
        return next(new ErrorCreator(StatusCodes.BAD_REQUEST, "Incorrect username or password."));
    }

    // Generate a JWT token for the authenticated user
    const token = jwt.sign({ id: admin.acc_id, user_name: admin.user_name }, constantVariables.JWT_SECRET_KEY, { expiresIn: '1h' });

    // Send the response with the JWT token
    return createResponse(res, StatusCodes.OK, "User logged in successfully.", { token });
});
