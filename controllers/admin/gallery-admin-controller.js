const { StatusCodes } = require("http-status-codes");
const ErrorCreator = require("../../config/error-creator-config");
const catchAsyncHandler = require("../../middlewares/catch-async-handler-middleware");
const { sqlQueryRunner } = require("../../config/database");
const { uploadMultipleImages, deleteImage } = require("../../config/cloudinary-config");
const createResponse = require("../../config/create-response-config");

module.exports = {
    uploadImages: catchAsyncHandler(async (req, res, next) => {
        const { files } = req;
        if (files.length === 0) {
            return next(new ErrorCreator(StatusCodes.BAD_REQUEST, "Images are required."));
        }

        const imagesData = await uploadMultipleImages(files);

        const insertSql = `
            INSERT INTO gallery (acc_id, url, public_id)
            VALUES (?, ?, ?)
        `;

        await Promise.all(imagesData.map(async (image) => {
            await sqlQueryRunner(insertSql, [req?.user?.acc_id, image.url, image.public_id]);
        }));

        return createResponse(res, StatusCodes.CREATED, "Images uploaded successfully.");
    }),

    deleteImage: catchAsyncHandler(async (req, res, next) => {
        const { public_id } = req.body;

        if (!public_id) {
            return next(new ErrorCreator(StatusCodes.BAD_REQUEST, "Public ID is required."));
        }

        await deleteImage(public_id);

        const deleteSql = `DELETE FROM gallery WHERE public_id = ?`;
        await sqlQueryRunner(deleteSql, [public_id]);

        return createResponse(res, StatusCodes.OK, "Image deleted successfully.");
    }),

    getAllImages: catchAsyncHandler(async (req, res, next) => {
        const getImagesSql = `SELECT * FROM gallery WHERE acc_id = ? ORDER BY created_at DESC;`;
        const images = await sqlQueryRunner(getImagesSql, [req?.user?.acc_id]);

        if (images.length === 0) {
            return createResponse(res, StatusCodes.OK, "No images found.", []);
        }

        return createResponse(res, StatusCodes.OK, "Images retrieved successfully.", images);
    })
};
