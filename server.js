const express = require("express");
const cors = require("cors");
const helmet = require("helmet")
const uploadMulterMiddleware = require("./middlewares/multer-middleware");
const errorHandler = require("./middlewares/error-handler-middleware");
const constantVariables = require("./config/constant-variables");
const superAdminRoutes = require("./routes/super-admin-routes");
const createResponse = require("./config/create-response-config");
const { StatusCodes } = require("http-status-codes");
const adminRoutes = require("./routes/admin-routes");
const storeRoutes = require("./routes/store-routes");
const contactRoutes = require("./routes/contact-routes");
const allowedOriginMiddlware = require("./middlewares/allowed-origin-middlware");

const app = express();

// Middleware
app.use(helmet())
// app.use(cors({ origin: allowedOriginMiddlware }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(uploadMulterMiddleware.any());
app.use(express.json({ limit: '10kb' }));

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
app.use('/home', contactRoutes);

// Error Handler
app.use(errorHandler);

// Start server
app.listen(constantVariables.PORT, () => {
    console.log('🚀 Server is running at port: ' + constantVariables.PORT);
});