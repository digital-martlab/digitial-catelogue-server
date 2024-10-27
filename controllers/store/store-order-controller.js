const { StatusCodes } = require("http-status-codes");
const createResponse = require("../../config/create-response-config");
const catchAsyncHandler = require("../../middlewares/catch-async-handler-middleware");
const { sqlQueryRunner } = require("../../config/database");

module.exports = {
    createOrder: catchAsyncHandler(async (req, res, next) => {
        const { cartItems, userDetails } = req.body;
        const products = [];

        for (const item of cartItems) {
            const { product_id, variant_id, quantity } = item;

            //         // Step 1: Check if enough stock is available
            //         const checkStockQuery = `
            //             SELECT stock FROM product_variants 
            //             WHERE variant_id = ?`;
            //         const stockResult = await sqlQueryRunner(checkStockQuery, [variant_id]);

            //         if (stockResult.length === 0 || stockResult[0].stock < quantity) {
            //             return createResponse(res, StatusCodes.BAD_REQUEST, `Not enough stock for variant ID: ${variant_id}`);
            //         }

            //         // Step 2: Decrease the stock
            //         const decreaseStockQuery = `
            //             UPDATE product_variants 
            //             SET stock = stock - ? 
            //             WHERE variant_id = ? AND product_id = ?`;
            //         await sqlQueryRunner(decreaseStockQuery, [quantity, variant_id, product_id]);

            //         // Query to fetch product details
            const productSql = `
                SELECT p.*, c.ctg_name
                FROM products p
                JOIN product_category c ON p.ctg_id = c.ctg_id
                WHERE p.product_id = ?
            `;
            const productData = await sqlQueryRunner(productSql, [product_id]);
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
            products.push({
                ...productData[0],
                images,
                variants,
            });
        }

        // client.messages.create({
        //     from: 'whatsapp:+918858704020',
        //     body: 'Ahoy world!',
        //     to: 'whatsapp:+918917726220'
        // }).then(message => console.log(message.sid));

        return createResponse(res, StatusCodes.OK, "Order created successfully.");
    })
}