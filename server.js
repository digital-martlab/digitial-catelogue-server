const express = require("express");
const cors = require("cors");
const uploadMulterMiddleware = require("./middlewares/multer-middleware");
const errorHandler = require("./middlewares/error-handler-middleware");
const constantVariables = require("./config/constant-variables");
const superAdminRoutes = require("./routes/super-admin-routes");
const createResponse = require("./config/create-response-config");
const { StatusCodes } = require("http-status-codes");
const adminRoutes = require("./routes/admin-routes");
const storeRoutes = require("./routes/store-routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(uploadMulterMiddleware.any());

// Route
app.get('/', (_, res) => {
    return createResponse(
        res,
        StatusCodes.OK,
        'Server is up and running smoothly.'
    );
});
app.use('/store', storeRoutes);
app.use('/super-admin', superAdminRoutes);
app.use('/admin', adminRoutes);

// Error Handler
app.use(errorHandler);

// Start server
app.listen(constantVariables.PORT, () => {
    console.log('🚀 Server is running at port: ' + constantVariables.PORT);
});

/**
 * STORE-107795MVAY: 62189WTO6M
 * STORE-18469BR156: 9957M1FPQS
 */