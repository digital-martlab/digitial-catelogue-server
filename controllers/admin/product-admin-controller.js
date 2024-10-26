const { StatusCodes } = require('http-status-codes');
const ErrorCreator = require('../../config/error-creator-config');
const catchAsyncHandler = require('../../middlewares/catch-async-handler-middleware');
const {
    beginTransaction,
    commitTransaction,
    rollbackTransaction,
    sqlQueryRunner,
} = require('../../config/database');
const createResponse = require('../../config/create-response-config');

module.exports = {
    createProduct: catchAsyncHandler(async (req, res, next) => {
        const { title, description, categoryId, variants, selectedImages } = req.body;

        // Validate the input data
        if (!categoryId || !title.trim() || !description.trim() || variants.some(v => !v.variantTitle || !v.price || !v.stock) || !selectedImages[0]) {
            return next(
                new ErrorCreator(
                    StatusCodes.BAD_REQUEST,
                    'Please fill out all fields, including at least one image, title, description, and valid variant details.'
                )
            );
        }

        const connection = await beginTransaction();

        try {
            // Check if category exists
            const categoryCheckSql = `
            SELECT * FROM product_category WHERE ctg_id = ?
        `;
            const [categoryCheckResult] = await connection.execute(categoryCheckSql, [categoryId]);

            if (categoryCheckResult.length === 0) {
                throw new ErrorCreator(
                    StatusCodes.BAD_REQUEST,
                    'Invalid category. Please select a valid category.'
                );
            }

            // Insert into the products table
            const productSql = `
            INSERT INTO products (title, description, ctg_id, acc_id)
            VALUES (?, ?, ?, ?)
        `;
            const productResult = await connection.execute(productSql, [
                title,
                description,
                categoryId,
                req?.user?.acc_id,
            ]);
            const productId = productResult[0].insertId;

            // Insert into product_variants
            const variantSql = `
            INSERT INTO product_variants (product_id, variant_title, price, stock)
            VALUES (?, ?, ?, ?)
        `;
            for (const variant of variants) {
                await connection.execute(variantSql, [
                    productId,
                    variant.variantTitle,
                    variant.price,
                    variant.stock,
                ]);
            }

            // Insert selected images into product_images
            const productImageSql = `
            INSERT INTO product_images (acc_id, gallery_id, product_id)
            VALUES (?, ?, ?)
        `;
            for (const image of selectedImages) {
                await connection.execute(productImageSql, [req?.user?.acc_id, image.gallery_id, productId]);
            }

            // Commit the transaction
            await commitTransaction(connection);

            res.status(StatusCodes.CREATED).json({ message: 'Product created successfully!' });
        } catch (error) {
            // Rollback in case of error
            await rollbackTransaction(connection);
            next(error); // Pass the error to the error handler middleware
        }
    }),

    getAllProducts: catchAsyncHandler(async (req, res, next) => {
        const { categoryId, search, page = 1, limit = 10 } = req.query;
        const pageInt = parseInt(page);
        const limitInt = parseInt(limit);
        const offset = (pageInt - 1) * limitInt;

        // Base SQL query
        let productsSql = `
        SELECT p.*, c.ctg_name
        FROM products p
        JOIN product_category c ON p.ctg_id = c.ctg_id
        WHERE 1=1
    `;

        // Array to hold query parameters
        const queryParams = [];

        // Filter by categoryId if provided
        if (categoryId) {
            productsSql += ` AND p.ctg_id = ?`;
            queryParams.push(categoryId);
        }

        // Search functionality
        if (search) {
            productsSql += ` AND (p.title LIKE ? OR p.description LIKE ?)`;
            const searchTerm = `%${search}%`;
            queryParams.push(searchTerm, searchTerm);
        }

        // Add pagination and ordering
        productsSql += ` ORDER BY p.created_at DESC`;
        // queryParams.push(limitInt, offset);

        // Execute query with the assembled parameters
        const data = await sqlQueryRunner(productsSql, queryParams);

        // Prepare queries for images and variants
        const imageSql = `
        SELECT product_images.img_id, gallery.url
        FROM product_images
        JOIN gallery ON gallery.gallery_id = product_images.gallery_id
        WHERE product_images.product_id = ?
    `;

        const variantSql = `SELECT * FROM product_variants WHERE product_id = ?`;

        // Fetch images and variants concurrently
        const productDataPromises = data.map(async (item) => {
            const imagesPromise = sqlQueryRunner(imageSql, [item.product_id]);
            const variantsPromise = sqlQueryRunner(variantSql, [item.product_id]);

            const [images, variants] = await Promise.all([imagesPromise, variantsPromise]);

            return {
                ...item,
                images,
                variants,
            };
        });

        // Wait for all product data to be resolved
        const productsWithDetails = await Promise.all(productDataPromises);

        return createResponse(res, StatusCodes.OK, "Products fetched successfully.", productsWithDetails);
    }),

    productActiveStatus: catchAsyncHandler(async (req, res, next) => {
        const { product_id } = req.body;

        if (!product_id)
            next(new ErrorCreator(StatusCodes.BAD_REQUEST, "product_id is required."));

        const sql = `SELECT * FROM products WHERE product_id = ?`;
        const data = await sqlQueryRunner(sql, [product_id]);

        if (data.length === 0) {
            return next(new ErrorCreator(StatusCodes.BAD_REQUEST, "Store doesn't exist with this id."));
        }

        console.log(`Current active status: ${data[0].is_active}`);

        const newStatus = !data[0].is_active;
        const updateSql = `UPDATE products SET is_active = ? WHERE product_id = ?`;
        await sqlQueryRunner(updateSql, [newStatus, product_id]);

        return createResponse(res, StatusCodes.OK, "Product active status updated successfully.");
    }),

    deleteProduct: catchAsyncHandler(async (req, res, next) => {
        const { product_id } = req.body; // Assuming product_id is passed as a URL parameter

        if (!product_id) {
            return next(new ErrorCreator(StatusCodes.BAD_REQUEST, "product_id is required."));
        }

        const connection = await beginTransaction();

        try {
            // Check if the product exists
            const productCheckSql = `SELECT * FROM products WHERE product_id = ?`;
            const [productCheckResult] = await connection.execute(productCheckSql, [product_id]);

            if (productCheckResult.length === 0) {
                return next(new ErrorCreator(StatusCodes.NOT_FOUND, "Product not found."));
            }

            // Delete associated images from product_images
            const deleteImagesSql = `DELETE FROM product_images WHERE product_id = ?`;
            await connection.execute(deleteImagesSql, [product_id]);

            // Delete associated variants from product_variants
            const deleteVariantsSql = `DELETE FROM product_variants WHERE product_id = ?`;
            await connection.execute(deleteVariantsSql, [product_id]);

            // Delete the product itself
            const deleteProductSql = `DELETE FROM products WHERE product_id = ?`;
            await connection.execute(deleteProductSql, [product_id]);

            // Commit the transaction
            await commitTransaction(connection);

            return createResponse(res, StatusCodes.OK, "Product deleted successfully.");
        } catch (error) {
            // Rollback in case of error
            await rollbackTransaction(connection);
            next(error); // Pass the error to the error handler middleware
        }
    }),

    getSingleProduct: catchAsyncHandler(async (req, res, next) => {
        const { product_id } = req.params; // Get product_id from URL parameters

        if (!product_id) {
            return next(new ErrorCreator(StatusCodes.BAD_REQUEST, "product_id is required."));
        }

        // Query to fetch product details
        const productSql = `
        SELECT p.*, c.ctg_name
        FROM products p
        JOIN product_category c ON p.ctg_id = c.ctg_id
        WHERE p.product_id = ?
    `;
        const productData = await sqlQueryRunner(productSql, [product_id]);

        if (productData.length === 0) {
            return next(new ErrorCreator(StatusCodes.NOT_FOUND, "Product not found."));
        }

        // Prepare queries for images and variants
        const imageSql = `
        SELECT product_images.*, gallery.*
        FROM product_images
        JOIN gallery ON gallery.gallery_id = product_images.gallery_id
        WHERE product_images.product_id = ?
    `;
        const variantSql = `SELECT * FROM product_variants WHERE product_id = ?`;

        // Fetch images and variants concurrently
        const imagesPromise = sqlQueryRunner(imageSql, [product_id]);
        const variantsPromise = sqlQueryRunner(variantSql, [product_id]);

        const [images, variants] = await Promise.all([imagesPromise, variantsPromise]);

        // Combine product data with images and variants
        const productWithDetails = {
            ...productData[0],
            images,
            variants,
        };

        return createResponse(res, StatusCodes.OK, "Product fetched successfully.", productWithDetails);
    }),

    updateProduct: catchAsyncHandler(async (req, res, next) => {
        const { title, description, categoryId, variants, selectedImages, product_id } = req.body;

        // Validate the input data
        if (!product_id || !categoryId || !title.trim() || !description.trim() ||
            variants.some(v => !v.variantTitle || !v.price || !v.stock) ||
            !selectedImages[0]) {
            return next(
                new ErrorCreator(
                    StatusCodes.BAD_REQUEST,
                    'Please fill out all fields, including at least one image, title, description, and valid variant details.'
                )
            );
        }

        const connection = await beginTransaction();

        try {
            // Delete existing images related to the product
            await connection.execute(`DELETE FROM product_images WHERE product_id = ?`, [product_id]);

            // Delete existing variants related to the product
            await connection.execute(`DELETE FROM product_variants WHERE product_id = ?`, [product_id]);

            // Update the products table with new details
            const updateProductSql = `
            UPDATE products 
            SET title = ?, description = ?, ctg_id = ?
            WHERE product_id = ?
        `;
            await connection.execute(updateProductSql, [title, description, categoryId, product_id]);

            // Insert new variants into product_variants
            const variantSql = `
            INSERT INTO product_variants (product_id, variant_title, price, stock)
            VALUES (?, ?, ?, ?)
        `;
            for (const variant of variants) {
                await connection.execute(variantSql, [
                    product_id,
                    variant.variantTitle,
                    variant.price,
                    variant.stock,
                ]);
            }

            // Insert new images into product_images
            const productImageSql = `
            INSERT INTO product_images (acc_id, gallery_id, product_id)
            VALUES (?, ?, ?)
        `;
            for (const image of selectedImages) {
                await connection.execute(productImageSql, [req?.user?.acc_id, image.gallery_id, product_id]);
            }

            // Commit the transaction
            await commitTransaction(connection);

            return createResponse(res, StatusCodes.OK, "Product updated successfully.");
        } catch (error) {
            // Rollback in case of error
            await rollbackTransaction(connection);
            next(error);
        }
    })
};
