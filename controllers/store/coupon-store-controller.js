const { StatusCodes } = require("http-status-codes");
const createResponse = require("../../config/create-response-config");
const { sqlQueryRunner } = require("../../config/database");
const catchAsyncHandler = require("../../middlewares/catch-async-handler-middleware");

module.exports = {
    applyCoupon: catchAsyncHandler(async (req, res, next) => {
        const { acc_id } = req.params;
        const { search } = req.query;

        const sql = `SELECT * FROM coupons WHERE acc_id = ? AND cpn_name = ?`;
        const data = await sqlQueryRunner(sql, [acc_id, search]);

        if (data.length > 0) {
            return createResponse(res, StatusCodes.OK, "Coupon applied successfully.", data[0]);
        }
        else
            return createResponse(res, StatusCodes.OK, "Invalid Coupon");
    })
}