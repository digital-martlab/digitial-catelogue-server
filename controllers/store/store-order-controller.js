const { StatusCodes } = require("http-status-codes");
const createResponse = require("../../config/create-response-config");
const catchAsyncHandler = require("../../middlewares/catch-async-handler-middleware");
const { beginTransaction, commitTransaction, rollbackTransaction } = require("../../config/database");

module.exports = {
    createOrder: catchAsyncHandler(async (req, res, next) => {
        const { cartItems, userDetails, totalAmount, appliedCoupon, storeInfo } = req.body;
        const products = [];

        // Start a transaction
        const connection = await beginTransaction();

        try {
            // Fetch store information based on store_id from storeInfo
            const storeQuery = `SELECT * FROM stores WHERE store_id = ?`;
            const storeResult = await connection.execute(storeQuery, [storeInfo.store_id]);

            if (!storeResult[0].length) {
                await rollbackTransaction(connection);
                return createResponse(res, StatusCodes.NOT_FOUND, "Store information not found.");
            }

            const storeDetails = storeResult[0][0];

            for (const item of cartItems) {
                const { product_id, variant_id, quantity } = item;

                // Step 1: Check if enough stock is available
                const checkStockQuery = `
                SELECT stock FROM product_variants 
                WHERE variant_id = ?`;
                const stockResult = await connection.execute(checkStockQuery, [variant_id]);

                if (stockResult[0].length === 0 || stockResult[0][0].stock < quantity) {
                    await rollbackTransaction(connection);
                    return createResponse(res, StatusCodes.BAD_REQUEST, `Not enough stock for variant ID: ${variant_id}`);
                }

                // Step 2: Decrease the stock
                const decreaseStockQuery = `
                UPDATE product_variants 
                SET stock = stock - ? 
                WHERE variant_id = ? AND product_id = ?`;
                await connection.execute(decreaseStockQuery, [quantity, variant_id, product_id]);

                // Fetch product details and associated data
                const productSql = `
                SELECT p.*, c.ctg_name
                FROM products p
                JOIN product_category c ON p.ctg_id = c.ctg_id
                WHERE p.product_id = ?`;
                const productData = await connection.execute(productSql, [product_id]);

                // Prepare queries for images and variants
                const imageSql = `
                SELECT product_images.*, gallery.*
                FROM product_images
                JOIN gallery ON gallery.gallery_id = product_images.gallery_id
                WHERE product_images.product_id = ?`;
                const variantSql = `SELECT * FROM product_variants WHERE product_id = ?`;

                // Fetch images and variants concurrently
                const [images, variants] = await Promise.all([
                    connection.execute(imageSql, [product_id]),
                    connection.execute(variantSql, [product_id])
                ]);

                // Find the selected variant details and calculate subtotal
                const selectedVariant = variants[0].find((v) => v.variant_id === variant_id);
                const productSubtotal = selectedVariant.price * quantity;

                // Combine product data with images and selected variant
                products.push({
                    title: productData[0][0].title,
                    variantTitle: selectedVariant.variant_title,
                    quantity,
                    price: selectedVariant.price,
                    subtotal: productSubtotal,
                    images: images[0],
                    ctg_name: productData[0][0].ctg_name
                });
            }

            // Prepare the WhatsApp message with store information
            const message = `
            Store Information:
            Name: ${storeDetails.name}
            Store Name: ${storeDetails.store_name}
            Contact:+91 ${storeDetails.number}

            Order Confirmation:
            Name: ${userDetails.name}
            Phone: ${userDetails.phone}
            Pincode: ${userDetails.pincode}
            Address: ${userDetails.address}

            Products:
            ${products.map(
                (product, index) =>
                    `${index + 1}. ${product.title} - ${product.variantTitle}  
                    Image: ${product?.images[0]?.url}
                    Quantity: ${product.quantity}  
                    Price: ₹${product.price}  
                    Subtotal: ₹${product.subtotal}`
            ).join('\n\n')}

            Total Amount: ₹${totalAmount}
            ${appliedCoupon ? `Discount Applied: ${appliedCoupon?.cpn_name}-${appliedCoupon?.cpn_discount}%` : ''}
            `.trim();

            // Update store order count
            await connection.execute(`UPDATE stores SET orders = ? WHERE acc_id = ?`, [storeDetails?.orders + 1, storeDetails?.acc_id]);

            // Commit transaction
            await commitTransaction(connection);

            const whatsappLink = `https://wa.me/91${storeDetails.number}?text=${encodeURIComponent(message)}`;
            return createResponse(res, StatusCodes.OK, "Order created successfully.", whatsappLink);

        } catch (error) {
            // Rollback transaction in case of error
            await rollbackTransaction(connection);
            next(error);
        }
    })
};
