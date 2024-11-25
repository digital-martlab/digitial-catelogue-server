const { StatusCodes } = require("http-status-codes");
const { uploadImage, deleteImage } = require("../../config/cloudinary-config");
const createResponse = require("../../config/create-response-config");
const { sqlQueryRunner } = require("../../config/database");
const catchAsyncHandler = require("../../middlewares/catch-async-handler-middleware");
const jwt = require("jsonwebtoken");
const constantVariables = require("../../config/constant-variables");

module.exports = {
    updateProfile: catchAsyncHandler(async (req, res, next) => {
        const file = req?.files?.[0];
        const { meta_title, meta_description, meta_keywords } = req.body;
        const acc_id = req.user.acc_id;

        let sqlQuery = `UPDATE stores SET`;
        let injectSql = [];

        if (meta_title) {
            sqlQuery += " meta_title = ?";
            injectSql.push(meta_title);
        }

        if (meta_description) {
            sqlQuery += " ,meta_description = ?";
            injectSql.push(meta_description);
        }

        if (meta_keywords) {
            sqlQuery += " ,meta_keywords = ?";
            injectSql.push(meta_keywords);
        }


        if (file) {
            const data = await sqlQueryRunner('SELECT * FROM stores WHERE acc_id = ?', [acc_id]);
            if (data[0]?.logo_id) {
                await deleteImage(data[0]?.logo_id);
            }

            const imageObj = await uploadImage(file);
            sqlQuery += " ,logo = ? ,logo_id = ?";
            injectSql.push(imageObj.url, imageObj.public_id);
        }

        sqlQuery += " WHERE acc_id = ?";
        injectSql.push(acc_id);

        await sqlQueryRunner(sqlQuery, injectSql);
        const updatedData = await sqlQueryRunner('SELECT * FROM stores WHERE acc_id = ?', [acc_id]);
        delete updatedData[0]?.password;
        const token = await jwt.sign(updatedData[0], constantVariables.JWT_SECRET_KEY);
        return createResponse(res, StatusCodes.OK, "Profile updated successfully.", token);
    })
}
