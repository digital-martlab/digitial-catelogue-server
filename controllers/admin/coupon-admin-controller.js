const { StatusCodes } = require("http-status-codes");
const ErrorCreator = require("../../config/error-creator-config");
const catchAsyncHandler = require("../../middlewares/catch-async-handler-middleware");
const { sqlQueryRunner } = require("../../config/database");
const createResponse = require("../../config/create-response-config");

module.exports = {
    createCoupon: catchAsyncHandler(async (req, res, next) => {
        const { cpn_name, cpn_discount } = req.body;

        if (!cpn_name || !cpn_discount)
            return next(new ErrorCreator(StatusCodes.BAD_REQUEST, "Coupon name and discount are required."));

        if (cpn_discount < 0 || cpn_discount > 100)
            next(new ErrorCreator(StatusCodes.BAD_REQUEST, "Discount must be between 0 and 100%."));



        const sql = `INSERT INTO coupons(cpn_name, cpn_discount, acc_id) VALUES(?, ?, ?)`;
        await sqlQueryRunner(sql, [cpn_name, cpn_discount, req?.user?.acc_id]);

        return createResponse(res, StatusCodes.CREATED, "Coupon created successfully.");
    }),

    getAllCoupons: catchAsyncHandler(async (req, res, next) => {
        const sql = `SELECT * FROM coupons WHERE acc_id = ?`;
        const data = await sqlQueryRunner(sql, [req?.user?.acc_id]);

        return createResponse(res, StatusCodes.OK, "Coupons fetched successfully.", data);
    }),

    updateCoupon: catchAsyncHandler(async (req, res, next) => {
        const { cpn_name, cpn_discount, cpn_id } = req.body;

        if (!cpn_name || !cpn_discount || !cpn_id)
            return next(new ErrorCreator(StatusCodes.BAD_REQUEST, "Coupon name, discount, and ID are required."));

        if (cpn_discount < 0 || cpn_discount > 100)
            next(new ErrorCreator(StatusCodes.BAD_REQUEST, "Discount must be between 0 and 100%."));

        const sql = `UPDATE coupons SET cpn_name = ?, cpn_discount = ? WHERE cpn_id = ? AND acc_id = ?`;
        await sqlQueryRunner(sql, [cpn_name, cpn_discount, cpn_id, req?.user?.acc_id]);

        return createResponse(res, StatusCodes.OK, "Coupon updated successfully.");
    }),

    deleteCoupon: catchAsyncHandler(async (req, res, next) => {
        const { cpn_id } = req.body;

        if (!cpn_id)
            return next(new ErrorCreator(StatusCodes.BAD_REQUEST, "Coupon ID is required."));

        const sql = `DELETE FROM coupons WHERE cpn_id = ? AND acc_id = ?`;
        await sqlQueryRunner(sql, [cpn_id, req?.user?.acc_id]);

        return createResponse(res, StatusCodes.OK, "Coupon deleted successfully.");
    })
};
