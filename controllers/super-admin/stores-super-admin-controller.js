const { StatusCodes } = require("http-status-codes");
const createResponse = require("../../config/create-response-config");
const catchAsyncHandler = require("../../middlewares/catch-async-handler-middleware");
const createSlug = require("../../config/slug-creator-config")
const ErrorCreator = require("../../config/error-creator-config");
const { sqlQueryRunner, beginTransaction, commitTransaction, rollbackTransaction } = require("../../config/database");
const bcrypt = require('bcrypt');
const { uploadImage, deleteImage } = require("../../config/cloudinary-config");
const constantVariables = require("../../config/constant-variables");
const { transporter, mailOptions } = require("../../config/email-config");
const { createStoreHtmlEmailTemplate, createStoreWhatsAppMessage } = require("../../templates/create-store-template");
const { generateStoreID, expiryDateGenerator } = require("../../config/generateStoreId");

module.exports = {
    createStore: catchAsyncHandler(async (req, res, next) => {
        const file = req?.files[0];
        const {
            name,
            email,
            number,
            store_name,
            password,
            state,
            city,
            area,
            meta_title,
            meta_description,
            meta_keywords,
            plan_id,
        } = req.body;

        // Validate required fields
        if (
            !file ||
            !name ||
            !email ||
            !number ||
            !store_name ||
            !password ||
            !state ||
            !city ||
            !area ||
            !meta_title ||
            !meta_description ||
            !meta_keywords ||
            !plan_id
        ) {
            return next(new ErrorCreator(StatusCodes.BAD_REQUEST, "All fields are required"));
        }

        // Generate store slug
        const slug = createSlug(store_name);

        // Check if email or store slug already exists
        const existingStoreQuery = "SELECT * FROM stores WHERE email = ? OR store_slug = ?";
        const existingStore = await sqlQueryRunner(existingStoreQuery, [email, slug]);
        if (existingStore.length > 0) {
            return next(new ErrorCreator(StatusCodes.CONFLICT, "Email or Store Name already exists"));
        }

        // Verify plan existence
        const planQuery = "SELECT * FROM plans WHERE plan_id = ?";
        const planData = await sqlQueryRunner(planQuery, [plan_id]);
        if (planData.length === 0) {
            return next(new ErrorCreator(StatusCodes.BAD_REQUEST, "Invalid plan_id provided."));
        }

        // Calculate plan expiry
        const planExpiresIn = expiryDateGenerator(planData[0]?.plan_duration_months);

        // Upload store logo to cloud storage
        const imageObj = await uploadImage(file);

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, constantVariables.SALT);

        // Insert new store data into the database
        const insertStoreQuery = `
        INSERT INTO stores 
        (name, email, number, store_name, store_slug, store_id, password, logo, logo_id, plan_expires_in, 
        meta_title, meta_description, meta_keywords, state, city, area, plan_id, paid_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        const insertedStore = await sqlQueryRunner(insertStoreQuery, [
            name,
            email,
            number,
            store_name,
            slug,
            generateStoreID(),
            hashedPassword,
            imageObj.url,
            imageObj.public_id,
            planExpiresIn,
            meta_title,
            meta_description,
            meta_keywords,
            state,
            city,
            area,
            plan_id,
            "PAID"
        ]);

        // Assign default theme to the store
        const themeQuery = "INSERT INTO theme (acc_id) VALUES (?)";
        await sqlQueryRunner(themeQuery, [insertedStore?.insertId]);

        // Prepare email and WhatsApp notifications
        req.body.plan_expires_in = planExpiresIn;
        req.body.plan_type = planData[0]?.plan_type;
        const subject = "Welcome to Catalogue Wala! Your New Store is Ready";
        const emailContent = createStoreHtmlEmailTemplate(req.body, password);

        await transporter.sendMail(mailOptions(email, subject, emailContent));
        const whatsAppMessage = createStoreWhatsAppMessage(req.body, password);

        return createResponse(
            res,
            StatusCodes.CREATED,
            "Store created successfully.",
            `https://wa.me/91${number}?text=${encodeURIComponent(whatsAppMessage)}`
        );
    }),

    getAllStores: catchAsyncHandler(async (req, res, next) => {
        let { search, page = 1, limit = 10 } = req.query;

        // Ensure `page` and `limit` are numbers
        page = parseInt(page, 10);
        limit = parseInt(limit, 10);
        const offset = (page - 1) * limit;

        // Base query to fetch all stores, excluding sensitive fields
        let baseSql = `
        SELECT acc_id, name, email, number, store_name, store_slug, store_id, is_active, 
               plan_expires_in, created_at, updated_at, logo, logo_id, state, city, area 
        FROM stores
    `;

        // Prepare search condition: search by name, store_name, store_id, number, city, or state
        const conditions = [];
        const values = [];

        if (search) {
            const searchQuery = `%${search}%`;
            conditions.push(`
            LOWER(name) LIKE LOWER(?) OR LOWER(store_name) LIKE LOWER(?) 
            OR store_id LIKE ? OR number LIKE ? OR LOWER(city) LIKE LOWER(?) 
            OR LOWER(state) LIKE LOWER(?)
        `);
            values.push(searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery);
        }

        // Add WHERE clause if there are any conditions
        if (conditions.length) {
            baseSql += ` WHERE ${conditions.join(" AND ")}`;
        }

        // Add ORDER BY, LIMIT, and OFFSET for pagination
        // baseSql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
        // values.push(limit, offset);

        try {
            // Execute the main query
            const data = await sqlQueryRunner(baseSql, values);

            // Query to get the total number of records
            const countSql = conditions.length
                ? `
                SELECT COUNT(*) as total FROM stores 
                WHERE ${conditions.join(" AND ")}
              `
                : `SELECT COUNT(*) as total FROM stores`;
            const totalData = await sqlQueryRunner(countSql, values.slice(0, -2)); // Exclude LIMIT and OFFSET
            const totalRecords = totalData[0]?.total || 0;

            // Return the paginated and filtered data
            return createResponse(res, StatusCodes.OK, "Stores fetched successfully.", {
                stores: data,
                currentPage: page,
                totalPages: Math.ceil(totalRecords / limit),
                totalRecords,
            });
        } catch (error) {
            throw error;
        }
    }),


    updateStoreActiveStatus: catchAsyncHandler(async (req, res, next) => {
        const { store_id } = req.params;

        if (!store_id)
            next(new ErrorCreator(StatusCodes.BAD_REQUEST, "store_id is required."));

        const sql = `SELECT * FROM stores WHERE store_id = ?`;
        const data = await sqlQueryRunner(sql, [store_id]);

        if (data.length === 0) {
            return next(new ErrorCreator(StatusCodes.BAD_REQUEST, "Store doesn't exist with this id."));
        }

        const newStatus = !data[0].is_active;
        const updateSql = `UPDATE stores SET is_active = ? WHERE store_id = ?`;
        await sqlQueryRunner(updateSql, [newStatus, store_id]);

        return createResponse(res, StatusCodes.OK, "Store active status updated successfully.");
    }),

    getSingleStore: catchAsyncHandler(async (req, res, next) => {
        const { store_id } = req.params;
        if (!store_id)
            next(new ErrorCreator(StatusCodes.BAD_REQUEST, "store_id is required."));

        const sql = "SELECT * FROM stores WHERE store_id = ?";
        const data = await sqlQueryRunner(sql, [store_id]);
        if (data.length === 0) {
            return next(new ErrorCreator(StatusCodes.BAD_REQUEST, "Store doesn't exist with this id."));
        }

        return createResponse(res, StatusCodes.OK, "Store fetched successfully.", data[0]);
    }),

    updateStore: catchAsyncHandler(async (req, res, next) => {
        const { store_id } = req.params;
        const { name, email, number, store_name, city, state, area } = req.body;
        const files = req?.files;

        // Validate required fields
        if (!store_name) {
            return next(new ErrorCreator(StatusCodes.BAD_REQUEST, "Store name is required."));
        }

        // Fetch the store to update
        const sql = "SELECT * FROM stores WHERE store_id = ?";
        const data = await sqlQueryRunner(sql, [store_id]);
        if (data.length === 0) {
            return next(new ErrorCreator(StatusCodes.BAD_REQUEST, "Store doesn't exist with this id."));
        }

        // Create a slug for the store name
        const slug = createSlug(store_name);

        // Check for duplicate email or slug
        const checkSql = `
        SELECT * 
        FROM stores 
        WHERE (email = ? OR store_slug = ?) 
        AND store_id != ?`;
        const existingData = await sqlQueryRunner(checkSql, [email, slug, store_id]);

        if (existingData.length > 0) {
            return next(new ErrorCreator(StatusCodes.CONFLICT, "Email or Store Name already exists"));
        }

        // Handle logo upload and deletion
        let imageObj = {};
        if (files && files.length > 0) {
            // Delete old logo if it exists
            if (data[0]?.logo_id) {
                await deleteImage(data[0]?.logo_id);
            }
            // Upload new logo
            imageObj = await uploadImage(files[0]);
        }

        // Update query with additional fields: city, state, and area
        const updateSql = `
        UPDATE stores 
        SET 
            name = ?, 
            email = ?, 
            number = ?, 
            store_name = ?, 
            store_slug = ?, 
            city = ?, 
            state = ?, 
            area = ?, 
            logo = ?, 
            logo_id = ? 
        WHERE store_id = ?`;

        const updateValues = [
            name,
            email,
            number,
            store_name,
            slug,
            city || data[0]?.city,
            state || data[0]?.state,
            area || data[0]?.area,
            files && files.length > 0 ? imageObj.url : data[0]?.logo,
            files && files.length > 0 ? imageObj.public_id : data[0]?.logo_id,
            store_id,
        ];

        // Execute the update query
        await sqlQueryRunner(updateSql, updateValues);

        // Send response
        return createResponse(res, StatusCodes.OK, "Store updated successfully.");
    }),

    deleteStore: catchAsyncHandler(async (req, res, next) => {
        const { acc_id, logo_id } = req.body;

        if (!acc_id) {
            return next(new ErrorCreator(StatusCodes.BAD_REQUEST, "Store Id is required."));
        }

        const connection = await beginTransaction();

        try {
            const images = await sqlQueryRunner('SELECT public_id FROM gallery WHERE acc_id = ?', [acc_id]);

            await Promise.all(images.map(image => deleteImage(image.public_id)));

            if (logo_id) {
                await deleteImage(logo_id);
            }

            await connection.execute('DELETE FROM product_images WHERE acc_id = ?', [acc_id]);
            await connection.execute('DELETE FROM products WHERE acc_id = ?', [acc_id]);
            await connection.execute('DELETE FROM gallery WHERE acc_id = ?', [acc_id]);
            await connection.execute('DELETE FROM stores WHERE acc_id = ?', [acc_id]);

            await commitTransaction(connection);

            return createResponse(res, StatusCodes.OK, "Store and related images deleted permanently.");
        } catch (error) {
            console.log(error);
            await rollbackTransaction(connection);
            return next(new ErrorCreator(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to delete store and images."));
        }
    })
};
