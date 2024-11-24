const { StatusCodes } = require("http-status-codes");
const ErrorCreator = require("../../config/error-creator-config");
const catchAsyncHandler = require("../../middlewares/catch-async-handler-middleware");
const { sqlQueryRunner } = require("../../config/database");
const createResponse = require("../../config/create-response-config");

module.exports = {
    // Fetch all plans
    getPlans: catchAsyncHandler(async (req, res, next) => {
        const data = await sqlQueryRunner(`SELECT * FROM plans ORDER BY plan_price DESC`);
        return createResponse(res, StatusCodes.OK, "Plans retrieved successfully.", data);
    }),

    // Create a new plan
    createPlan: catchAsyncHandler(async (req, res, next) => {
        const { plan_type, plan_price, plan_duration_months } = req.body;

        if (!plan_type || plan_price < 0 || !plan_duration_months) {
            return next(new ErrorCreator(StatusCodes.BAD_REQUEST, "All fields must be filled."));
        }

        const sql = `INSERT INTO plans(plan_type, plan_price, plan_duration_months) VALUES(?, ?, ?)`;
        await sqlQueryRunner(sql, [plan_type, plan_price, plan_duration_months]);

        return createResponse(res, StatusCodes.CREATED, "Plan created successfully.");
    }),

    // Update an existing plan
    updatePlan: catchAsyncHandler(async (req, res, next) => {
        const { plan_type, plan_price, plan_duration_months, plan_id } = req.body;

        if (!plan_id) {
            return next(new ErrorCreator(StatusCodes.BAD_REQUEST, "plan_id is required."));
        }

        if (!plan_type || !plan_price || !plan_duration_months) {
            return next(new ErrorCreator(StatusCodes.BAD_REQUEST, "All fields must be filled."));
        }

        const sql = `UPDATE plans SET plan_type = ?, plan_price = ?, plan_duration_months = ? WHERE plan_id = ?`;
        await sqlQueryRunner(sql, [plan_type, plan_price, plan_duration_months, plan_id]);

        return createResponse(res, StatusCodes.OK, "Plan updated successfully.");
    }),

    // Delete a plan
    deletePlan: catchAsyncHandler(async (req, res, next) => {
        const { plan_id } = req.body;

        if (!plan_id) {
            return next(new ErrorCreator(StatusCodes.BAD_REQUEST, "plan_id is required."));
        }

        const sql = `DELETE FROM plans WHERE plan_id = ?`;
        const result = await sqlQueryRunner(sql, [plan_id]);

        if (result.affectedRows === 0) {
            return next(new ErrorCreator(StatusCodes.NOT_FOUND, "Plan not found."));
        }

        return createResponse(res, StatusCodes.OK, "Plan deleted successfully.");
    }),
};
