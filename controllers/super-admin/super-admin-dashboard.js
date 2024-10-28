const { StatusCodes } = require("http-status-codes");
const { sqlQueryRunner } = require("../../config/database");
const createResponse = require("../../config/create-response-config");
const catchAsyncHandler = require("../../middlewares/catch-async-handler-middleware");

module.exports = catchAsyncHandler(async (req, res, next) => {
    // Initialize result object with just total stores and total contact messages
    const result = {
        total_stores: 0,
        total_contacts: 0,
    };

    // Query to count total stores
    const storesCountQuery = `
        SELECT COUNT(acc_id) AS total_stores 
        FROM stores;
    `;
    const storesData = await sqlQueryRunner(storesCountQuery);
    result.total_stores = storesData[0]?.total_stores || 0;

    // Query to count total contact messages
    const contactsCountQuery = `
        SELECT COUNT(id) AS total_contacts 
        FROM contact_us;
    `;
    const contactsData = await sqlQueryRunner(contactsCountQuery);
    result.total_contacts = contactsData[0]?.total_contacts || 0;

    // Send the response
    return createResponse(res, StatusCodes.OK, "Data fetched successfully.", result);
});
