const { StatusCodes } = require("http-status-codes");
const createResponse = require("../../config/create-response-config");
const { sqlQueryRunner } = require("../../config/database");
const catchAsyncHandler = require("../../middlewares/catch-async-handler-middleware");

module.exports = catchAsyncHandler(async (req, res, next) => {
    // Initialize result object
    const result = {
        total_categories: 0,
        total_active_products: 0,
        total_products: 0, // Added total_products
        total_coupons: 0,
    };

    // Query to count total categories
    const categoryCountQuery = `
        SELECT COUNT(ctg_id) AS total_categories 
        FROM product_category 
        WHERE acc_id = ?;
    `;
    const categoriesData = await sqlQueryRunner(categoryCountQuery, [req?.user?.acc_id]);
    result.total_categories = categoriesData[0]?.total_categories || 0;

    // Query to count total active products
    const activeProductsCountQuery = `
        SELECT COUNT(product_id) AS total_active_products 
        FROM products 
        WHERE acc_id = ? AND is_active = true;
    `;
    const activeProductsData = await sqlQueryRunner(activeProductsCountQuery, [req?.user?.acc_id]);
    result.total_active_products = activeProductsData[0]?.total_active_products || 0;

    // Query to count total products (including inactive ones)
    const totalProductsCountQuery = `
        SELECT COUNT(product_id) AS total_products 
        FROM products 
        WHERE acc_id = ?;
    `;
    const totalProductsData = await sqlQueryRunner(totalProductsCountQuery, [req?.user?.acc_id]);
    result.total_products = totalProductsData[0]?.total_products || 0;

    // Query to count total coupons
    const couponsCountQuery = `
        SELECT COUNT(cpn_id) AS total_coupons 
        FROM coupons 
        WHERE acc_id = ?;
    `;
    const couponsData = await sqlQueryRunner(couponsCountQuery, [req?.user?.acc_id]);
    result.total_coupons = couponsData[0]?.total_coupons || 0;

    // Send the response
    return createResponse(res, StatusCodes.OK, "Data fetched successfully.", result);
});
