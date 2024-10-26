const { StatusCodes } = require("http-status-codes");
const createResponse = require("../../config/create-response-config");
const catchAsyncHandler = require("../../middlewares/catch-async-handler-middleware");
const { sqlQueryRunner } = require("../../config/database");
const ErrorCreator = require("../../config/error-creator-config");

module.exports = {
    getStoreInfo: catchAsyncHandler(async (req, res, next) => {
        const { store_slug } = req.params;

        // Fetch store information
        const getSql = `SELECT * FROM stores WHERE store_slug = ?`;
        const storeData = await sqlQueryRunner(getSql, [store_slug]);
        const store = storeData[0];

        if (!store) {
            return next(new ErrorCreator(StatusCodes.NOT_FOUND, "Store not found."));
        }

        // Fetch categories based on acc_id from store data
        const categorySql = `SELECT * FROM product_category WHERE acc_id = ?`;
        const categories = await sqlQueryRunner(categorySql, [store.acc_id]);

        return createResponse(res, StatusCodes.OK, "Store info fetched successfully.", {
            store,
            categories
        });
    })
};
