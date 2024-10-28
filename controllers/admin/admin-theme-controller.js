const { StatusCodes } = require("http-status-codes");
const createResponse = require("../../config/create-response-config");
const { sqlQueryRunner } = require("../../config/database");
const catchAsyncHandler = require("../../middlewares/catch-async-handler-middleware");

module.exports = {
    getTheme: catchAsyncHandler(async (req, res) => {
        console.log(req?.user?.acc_id);
        const themeSql = `SELECT * FROM theme WHERE acc_id = ?`;
        const data = await sqlQueryRunner(themeSql, [req?.user?.acc_id]);
        createResponse(res, StatusCodes.OK, "Data fetched successfully.", data[0]);
    }),

    updateTheme: catchAsyncHandler(async (req, res) => {
        const { theme_color, theme_mod } = req.body;
        const acc_id = req?.user?.acc_id;

        const updateThemeSql = `UPDATE theme SET theme_color = ?, theme_mod = ? WHERE acc_id = ?`;
        await sqlQueryRunner(updateThemeSql, [theme_color, theme_mod, acc_id]);

        createResponse(res, StatusCodes.OK, "Theme updated successfully.");
    })
};
