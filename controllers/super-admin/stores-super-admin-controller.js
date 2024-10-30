const { StatusCodes } = require("http-status-codes");
const createResponse = require("../../config/create-response-config");
const catchAsyncHandler = require("../../middlewares/catch-async-handler-middleware");
const createSlug = require("../../config/slug-creator-config")
const ErrorCreator = require("../../config/error-creator-config");
const { sqlQueryRunner } = require("../../config/database");
const bcrypt = require('bcrypt');
const { uploadImage, deleteImage, uploadMultipleImages } = require("../../config/cloudinary-config");
const constantVariables = require("../../config/constant-variables");

module.exports = {
    createStore: catchAsyncHandler(async (req, res, next) => {
        const file = req?.files[0];
        const { name, email, number, store_name, store_id, password } = req.body;

        // Check for required fields
        if (!file || !name || !email || !number || !store_name || !store_id || !password) {
            return next(new ErrorCreator(StatusCodes.BAD_REQUEST, "All fields are required"));
        }

        // Create store slug
        const slug = createSlug(store_name);

        // SQL query to check if email or store_slug already exists
        const sql = `SELECT * FROM stores WHERE email = ? OR store_slug = ?`;
        const data = await sqlQueryRunner(sql, [email, slug]);

        if (data.length > 0) {
            return next(new ErrorCreator(StatusCodes.CONFLICT, "Email or Store Name already exists"));
        }

        const imageObj = await uploadImage(file);

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, constantVariables.SALT);

        const planExpiresIn = new Date(new Date());
        planExpiresIn.setFullYear(planExpiresIn.getFullYear() + 1);

        // SQL query to insert a new store
        const insertSql = `INSERT INTO stores (name, email, number, store_name, store_slug, store_id, password, logo, logo_id, plan_expires_in) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const insertedData = await sqlQueryRunner(insertSql, [name, email, number, store_name, slug, store_id, hashedPassword, imageObj.url, imageObj.public_id, planExpiresIn]);

        const themeSql = `INSERT INTO theme (acc_id) VALUES (?)`;
        await sqlQueryRunner(themeSql, [insertedData?.insertId]);

        return createResponse(res, StatusCodes.CREATED, "Store created successfully.");
    }),

    getAllStores: catchAsyncHandler(async (req, res, next) => {
        let { search, page = 1, limit = 10 } = req.query;

        // Ensure `page` and `limit` are numbers
        page = parseInt(page, 10);
        limit = parseInt(limit, 10);
        const offset = (page - 1) * limit;

        // Base query to fetch all stores, excluding sensitive fields
        let baseSql = `SELECT acc_id, name, email, number, store_name, store_slug, store_id, is_active, plan_expires_in, created_at, updated_at, logo 
                   FROM stores`;

        // Prepare search condition: search by name, store_name, store_id, or number
        if (search) {
            search = `%${search}%`;
            baseSql += ` WHERE LOWER(name) LIKE LOWER(?) OR LOWER(store_name) LIKE LOWER(?) 
                     OR store_id LIKE ? OR number LIKE ?`;
        }

        // Add LIMIT and OFFSET for pagination
        // baseSql += ` LIMIT ? OFFSET ?`;

        // Values to be passed to the query
        const values = search ? [search, search, search, search, limit, offset] : [limit, offset];

        try {
            // Execute the main query
            const data = await sqlQueryRunner(baseSql, values);

            // Query to get the total number of records
            const countSql = search
                ? `SELECT COUNT(*) as total FROM stores WHERE LOWER(name) LIKE LOWER(?) 
               OR LOWER(store_name) LIKE LOWER(?) OR store_id LIKE ? OR number LIKE ?`
                : `SELECT COUNT(*) as total FROM stores`;

            const totalValues = search ? [search, search, search, search] : [];
            const totalData = await sqlQueryRunner(countSql, totalValues);
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

        console.log(`Current active status: ${data[0].is_active}`);

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
        const { name, email, number, store_name } = req.body;
        const files = req?.files;

        if (!store_name) {
            return next(new ErrorCreator(StatusCodes.BAD_REQUEST, "Store name is required."));
        }

        const sql = "SELECT * FROM stores WHERE store_id = ?";
        const data = await sqlQueryRunner(sql, [store_id]);
        if (data.length === 0) {
            return next(new ErrorCreator(StatusCodes.BAD_REQUEST, "Store doesn't exist with this id."));
        }

        const slug = createSlug(store_name);

        const checkSql = `SELECT * FROM stores WHERE (email = ? OR store_slug = ?) AND store_id != ?`;
        const existingData = await sqlQueryRunner(checkSql, [email, slug, store_id]);

        if (existingData.length > 0) {
            return next(new ErrorCreator(StatusCodes.CONFLICT, "Email or Store Name already exists"));
        }

        let imageObj = {};
        if (files && files.length > 0) {
            if (data[0]?.logo_id) {
                await deleteImage(data[0]?.logo_id);
            }
            imageObj = await uploadImage(files[0]);
        }

        const updateSql = `
        UPDATE stores 
        SET 
        name = ?, 
        email = ?, 
        number = ?, 
        store_name = ?, 
        store_slug = ?,
        logo = ?, 
        logo_id = ?
        WHERE store_id = ?`;

        const updateValues = [
            name,
            email,
            number,
            store_name,
            slug,
            files && files.length > 0 ? imageObj.url : data[0]?.logo,
            files && files.length > 0 ? imageObj.public_id : data[0]?.logo_id,
            store_id
        ];

        await sqlQueryRunner(updateSql, updateValues);
        return createResponse(res, StatusCodes.OK, "Store updated successfully.");
    }),

    deleteStore: catchAsyncHandler(async (req, res, next) => {
        const { store_id } = req?.body;

        if (!store_id)
            next(new ErrorCreator(StatusCodes.BAD_REQUEST, "Store Id is required."))

        await sqlQueryRunner('DELETE FROM stores WHERE acc_id = ?', [store_id]);
        return createResponse(res, StatusCodes.OK, "Store deleted permanently.");
    })
};
