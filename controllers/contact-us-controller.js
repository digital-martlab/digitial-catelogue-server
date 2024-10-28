const { StatusCodes } = require("http-status-codes");
const ErrorCreator = require("../config/error-creator-config");
const catchAsyncHandler = require("../middlewares/catch-async-handler-middleware");
const createResponse = require("../config/create-response-config");
const { sqlQueryRunner } = require("../config/database");

module.exports = {
    createContact: catchAsyncHandler(async (req, res, next) => {
        const { name, email, phone, message } = req.body;

        // Validate the incoming data
        if (!name || !email || !phone || !message) {
            next(new ErrorCreator(StatusCodes.BAD_REQUEST, "All fields are required."));
        }

        // SQL query to insert contact data
        const sql = `
            INSERT INTO contact_us (name, email, phone, message)
            VALUES (?, ?, ?, ?)
        `;

        const params = [name, email, phone, message];

        await sqlQueryRunner(sql, params);
        return createResponse(res, StatusCodes.CREATED, "Contact message submitted successfully!");
    }),

    getContacts: catchAsyncHandler(async (req, res) => {
        const { search } = req.query;

        let sql = `
            SELECT * FROM contact_us
        `;

        const params = [];

        if (search) {
            sql += `
                WHERE name LIKE ? OR email LIKE ? OR phone LIKE ?
            `;
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        sql += ` ORDER BY created_at DESC`;

        const contacts = await sqlQueryRunner(sql, params);
        return createResponse(res, StatusCodes.OK, "Contacts retrieved successfully!", contacts);
    }),

    deleteContact: catchAsyncHandler(async (req, res) => {
        const { id } = req.body;

        if (!id) {
            throw new ErrorCreator(StatusCodes.BAD_REQUEST, "Contact ID is required.");
        }

        const sql = `
            DELETE FROM contact_us
            WHERE id = ?
        `;

        const result = await sqlQueryRunner(sql, [id]);

        if (result.affectedRows === 0) {
            throw new ErrorCreator(StatusCodes.NOT_FOUND, "Contact not found.");
        }

        return createResponse(res, StatusCodes.OK, "Contact message deleted successfully!");
    }),
};
