const { StatusCodes } = require("http-status-codes");
const createResponse = require("../../config/create-response-config");
const catchAsyncHandler = require("../../middlewares/catch-async-handler-middleware");
const ErrorCreator = require("../../config/error-creator-config");
const { sqlQueryRunner } = require("../../config/database");

module.exports = {
    createCategory: catchAsyncHandler(async (req, res, next) => {
        const { category_name } = req.body;

        if (!category_name) {
            return next(new ErrorCreator(StatusCodes.BAD_REQUEST, "Category name is required."));
        }

        const checkSql = `SELECT * FROM product_category WHERE ctg_name = ? AND acc_id = ?`;
        const existingCategory = await sqlQueryRunner(checkSql, [category_name, req.user.acc_id]);

        if (existingCategory.length > 0) {
            return next(new ErrorCreator(StatusCodes.CONFLICT, "Category already exists."));
        }

        const insertSql = `INSERT INTO product_category(ctg_name, acc_id) VALUES(?, ?)`;
        await sqlQueryRunner(insertSql, [category_name, req.user.acc_id]);

        return createResponse(res, StatusCodes.CREATED, "Category created successfully.");
    }),

    getAllCategory: catchAsyncHandler(async (req, res, next) => {
        const sql = `SELECT * FROM product_category WHERE acc_id = ?`;
        const data = await sqlQueryRunner(sql, [req?.user?.acc_id]);
        return createResponse(res, StatusCodes.OK, "categories fetched successfully.", data);
    }),

    updateCategory: catchAsyncHandler(async (req, res, next) => {
        const { category_name, ctg_id } = req.body;

        if (!category_name) {
            return next(new ErrorCreator(StatusCodes.BAD_REQUEST, "Category name is required."));
        }
        if (!ctg_id) {
            return next(new ErrorCreator(StatusCodes.BAD_REQUEST, "Category ID is required."));
        }


        const checkSql = `SELECT * FROM product_category WHERE ctg_id = ? AND acc_id = ?`;
        const category = await sqlQueryRunner(checkSql, [ctg_id, req.user.acc_id]);

        if (category.length === 0) {
            return next(new ErrorCreator(StatusCodes.NOT_FOUND, "Category not found."));
        }


        const sql = `UPDATE product_category SET ctg_name = ? WHERE ctg_id = ? AND acc_id = ?`;
        const result = await sqlQueryRunner(sql, [category_name, ctg_id, req.user.acc_id]);

        if (result.affectedRows === 0) {
            return next(new ErrorCreator(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to update category."));
        }

        return createResponse(res, StatusCodes.OK, "Category updated successfully.");
    }),

    deleteCategory: catchAsyncHandler(async (req, res, next) => {
        const { ctg_id } = req.body;
        const sql = `DELETE FROM product_category WHERE ctg_id = ? AND acc_id=?`;
        const data = await sqlQueryRunner(sql, [ctg_id, req?.user?.acc_id]);
        return createResponse(res, StatusCodes.OK, "category deleted successfully.");
    })
}