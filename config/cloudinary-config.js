const { StatusCodes } = require("http-status-codes");
const ErrorCreator = require("../config/error-creator-config");
const { v2: cloudinary } = require("cloudinary");
const constantVariables = require("./constant-variables");
const fs = require('fs');


// Connecting to Cloudinary
cloudinary.config({
    cloud_name: constantVariables.CLOUDINARY_NAME,
    api_key: constantVariables.CLOUDINARY_API_KEY,
    api_secret: constantVariables.CLOUDINARY_SECRET_KEY,
});

/**
 * Uploads an image to Cloudinary.
 * @param {File} file - The file to upload.
 * @returns {Promise<Object>} - Returns the uploaded image data (URL, public_id, etc.).
 */
const uploadImage = async (file) => {
    try {
        const buffer = file.buffer;

        return new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        resource_type: "image",
                        folder: "catelogue",
                    },
                    (error, result) => {
                        if (error) {
                            return reject(
                                new ErrorCreator(StatusCodes.BAD_REQUEST, error.message),
                            );
                        }
                        resolve({
                            url: result?.secure_url,
                            public_id: result?.public_id,
                        });
                    },
                )
                .end(buffer);
        });
    } catch (error) {
        console.log(error);
        throw new ErrorCreator(
            StatusCodes.INTERNAL_SERVER_ERROR,
            `Failed to upload image`,
        );
    }
};

/**
 * Uploads multiple images to Cloudinary.
 * @param {File[]} files - An array of files to upload.
 * @returns {Promise<Object[]>} - Returns an array of uploaded image data.
 */
const uploadMultipleImages = async (files) => {
    const FilesPromise = files.map((file) => uploadImage(file));
    const images = await Promise.all(FilesPromise);
    return images;
};

/**
 * Deletes an image from Cloudinary by public ID.
 * @param {string} publicId - The public ID of the image to delete.
 * @returns {Promise<Object>} - Returns the result of the deletion.
 */
const deleteImage = async (publicId) => {
    try {
        if (!publicId) {
            throw new ErrorCreator(StatusCodes.BAD_REQUEST, "Public ID is required.");
        }

        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result !== "ok") {
            throw new ErrorCreator(StatusCodes.NOT_FOUND, "Image not found.");
        }

        return result;
    } catch (error) {
        console.log(error);
        throw new ErrorCreator(
            StatusCodes.INTERNAL_SERVER_ERROR,
            `Unable to delete the image because it is currently in use elsewhere.`,
        );
    }
};

// Helper to convert file to Base64
const imageToBase64 = (file) => {
    if (file?.size > 500 * 1024)
        throw new Error("File size must be less than 500kb");
    return file.buffer.toString("base64");
};

module.exports = {
    uploadImage,
    uploadMultipleImages,
    deleteImage,
    imageToBase64
}