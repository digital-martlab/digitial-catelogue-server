const { StatusCodes } = require("http-status-codes");
const createResponse = require("../../config/create-response-config");
const ErrorCreator = require("../../config/error-creator-config");
const catchAsyncHandler = require("../../middlewares/catch-async-handler-middleware");
const { sqlQueryRunner } = require("../../config/database");

module.exports = {
    getAllProducts: catchAsyncHandler(async (req, res, next) => {
        const { acc_id } = req.params;

        if (!acc_id) {
            return next(new ErrorCreator(StatusCodes.BAD_REQUEST, "Store ID is required"));
        }

        // Base SQL query
        let productsSql = `
            SELECT p.*, c.ctg_name
            FROM products p
            JOIN product_category c ON p.ctg_id = c.ctg_id
            WHERE is_active = true AND p.acc_id = ?
        `;

        // Add ordering
        productsSql += ` ORDER BY p.created_at DESC`;

        // Execute the query with assembled parameters
        const products = await sqlQueryRunner(productsSql, [acc_id]);

        // SQL queries for images and variants
        const imageSql = `
            SELECT product_images.img_id, gallery.url
            FROM product_images
            JOIN gallery ON gallery.gallery_id = product_images.gallery_id
            WHERE product_images.product_id = ?
        `;
        const variantSql = `SELECT * FROM product_variants WHERE product_id = ?`;

        // Fetch images and variants for each product
        const productsWithDetails = await Promise.all(
            products.map(async (product) => {
                const [images, variants] = await Promise.all([
                    sqlQueryRunner(imageSql, [product.product_id]),
                    sqlQueryRunner(variantSql, [product.product_id])
                ]);

                return {
                    ...product,
                    images,
                    variants
                };
            })
        );
        return createResponse(res, StatusCodes.OK, "Products fetched successfully.", productsWithDetails);
    }),

    getFilteredProduct: catchAsyncHandler(async (req, res, next) => {
        const { acc_id } = req.params;
        const { ctg_id, search } = req.query;

        if (!acc_id) {
            return next(new ErrorCreator(StatusCodes.BAD_REQUEST, "Store ID is required"));
        }

        // Base SQL query
        let productsSql = `
            SELECT p.*, c.ctg_name
            FROM products p
            JOIN product_category c ON p.ctg_id = c.ctg_id
            WHERE is_active = true AND p.acc_id = ?
        `;

        // Array to hold query parameters
        const queryParams = [acc_id];

        // Filter by category ID if provided
        if (ctg_id) {
            productsSql += ` AND p.ctg_id = ?`;
            queryParams.push(ctg_id);
        }

        // Search functionality
        if (search) {
            productsSql += ` AND (p.title LIKE ? OR p.description LIKE ?)`;
            const searchTerm = `%${search}%`;
            queryParams.push(searchTerm, searchTerm);
        }

        // Add ordering
        productsSql += ` ORDER BY p.created_at DESC`;

        // Execute the query with assembled parameters
        const products = await sqlQueryRunner(productsSql, queryParams);

        // SQL queries for images and variants
        const imageSql = `
            SELECT product_images.img_id, gallery.url
            FROM product_images
            JOIN gallery ON gallery.gallery_id = product_images.gallery_id
            WHERE product_images.product_id = ?
        `;
        const variantSql = `SELECT * FROM product_variants WHERE product_id = ?`;

        // Fetch images and variants for each product
        const productsWithDetails = await Promise.all(
            products.map(async (product) => {
                const [images, variants] = await Promise.all([
                    sqlQueryRunner(imageSql, [product.product_id]),
                    sqlQueryRunner(variantSql, [product.product_id])
                ]);

                return {
                    ...product,
                    images,
                    variants
                };
            })
        );
        return createResponse(res, StatusCodes.OK, "Products fetched successfully.", productsWithDetails);
    })
};
