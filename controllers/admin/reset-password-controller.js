const { StatusCodes } = require("http-status-codes");
const ErrorCreator = require("../../config/error-creator-config");
const catchAsyncHandler = require("../../middlewares/catch-async-handler-middleware");
const { isValidEmail, transporter, mailOptions } = require("../../config/email-config");
const { sqlQueryRunner } = require("../../config/database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const createResponse = require("../../config/create-response-config");
const constantVariables = require("../../config/constant-variables");

module.exports = {
    sendResetMail: catchAsyncHandler(async (req, res, next) => {
        const { email } = req?.body;

        if (!email) next(new ErrorCreator(StatusCodes.BAD_REQUEST, "Email is required."));

        if (!isValidEmail(email)) next(new ErrorCreator(StatusCodes.BAD_REQUEST, "Email is not valid."));

        const storeExist = await sqlQueryRunner(`SELECT * FROM stores WHERE email = ?`, [email]);

        if (storeExist.length === 0) next(new ErrorCreator(StatusCodes.BAD_REQUEST, `Email not found with this mail.`));

        const { acc_id, name, store_id } = storeExist[0];

        const token = jwt.sign({ acc_id, name, store_id }, constantVariables.JWT_SECRET_KEY, { expiresIn: "5m" });

        const subject = "Password Reset Request - Catalogue Wala";
        const content = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
            color: #333;
        }
        .container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #007BFF;
        }
        a {
            color: #007BFF;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Password Reset Request</h1>
        <p>Dear ${name},</p>
        <p>We received a request to reset the password associated with your account.</p>
        <p>Please use the link below to reset your password. Note that this link will expire in 5 minutes for security reasons:</p>
        <p><a href="https://cataloguewala.com/admin/reset-password/${token}">Reset Password</a></p>
        <p>If you did not request this password reset, please disregard this message.</p>
        <p>Best regards,<br>The Support Team</p>
    </div>
    <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Catalogue Wala. All rights reserved.</p>
    </div>
</body>
</html>
`;

        await transporter.sendMail(mailOptions(email, subject, content));

        return createResponse(res, StatusCodes.OK, "A password reset email has been sent to your email address. Please check your inbox.");
    }),

    resetPassword: catchAsyncHandler(async (req, res, next) => {
        const { token, newPassword } = req?.body;

        if (!token) next(new ErrorCreator(StatusCodes.BAD_REQUEST, "Token is required."));
        if (!newPassword) next(new ErrorCreator(StatusCodes.BAD_REQUEST, "New password is required."));

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, constantVariables.JWT_SECRET_KEY);
        } catch (err) {
            next(new ErrorCreator(StatusCodes.UNAUTHORIZED, "Invalid or expired token."));
            return;
        }

        const { acc_id } = decodedToken;

        const userExist = await sqlQueryRunner(`SELECT * FROM stores WHERE acc_id = ?`, [acc_id]);
        if (userExist.length === 0) {
            next(new ErrorCreator(StatusCodes.NOT_FOUND, "Store not found."));
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updateResult = await sqlQueryRunner(`UPDATE stores SET password = ? WHERE acc_id = ?`, [hashedPassword, acc_id]);

        if (updateResult.affectedRows === 0) {
            next(new ErrorCreator(StatusCodes.INTERNAL_SERVER_ERROR, "Password reset failed. Please try again."));
            return;
        }

        return createResponse(res, StatusCodes.OK, "Your password has been successfully reset.");
    })
}
