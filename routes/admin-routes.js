const express = require("express");
const loginAdminController = require("../controllers/admin/login-admin-controller");
const categoryAdminController = require("../controllers/admin/category-admin-controller");
const verifyJWT = require("../middlewares/auth-middleware");
const { ROLES } = require("../config/roles-config");
const couponAdminController = require("../controllers/admin/coupon-admin-controller");
const passwordChangeAdmin = require("../controllers/admin/password-change-admin");
const productAdminController = require("../controllers/admin/product-admin-controller");
const galleryAdminController = require("../controllers/admin/gallery-admin-controller");
const adminDashboardController = require("../controllers/admin/admin-dashboard-controller");

const adminRoutes = express.Router();

adminRoutes.post("/login", loginAdminController);

adminRoutes.get("/dashboard", verifyJWT([ROLES.ADMIN]), adminDashboardController);

// Category Section
adminRoutes.use("/category", verifyJWT([ROLES.ADMIN]))
adminRoutes.route("/category")
    .post(categoryAdminController.createCategory)
    .get(categoryAdminController.getAllCategory)
    .patch(categoryAdminController.updateCategory)
    .delete(categoryAdminController.deleteCategory);

// Coupon Section
adminRoutes.use("/coupon", verifyJWT([ROLES.ADMIN]))
adminRoutes.route("/coupon")
    .post(couponAdminController.createCoupon)
    .get(couponAdminController.getAllCoupons)
    .patch(couponAdminController.updateCoupon)
    .delete(couponAdminController.deleteCoupon);

adminRoutes.use("/gallery", verifyJWT([ROLES.ADMIN]));
adminRoutes.route("/gallery")
    .post(galleryAdminController.uploadImages)
    .get(galleryAdminController.getAllImages)
    .delete(galleryAdminController.deleteImage);

// Product Section
adminRoutes.use("/product", verifyJWT([ROLES.ADMIN]))
adminRoutes.route("/product")
    .post(productAdminController.createProduct)
    .get(productAdminController.getAllProducts)
    .put(productAdminController.productActiveStatus)
    .delete(productAdminController.deleteProduct)
    .patch(productAdminController.updateProduct);

adminRoutes.get("/product/:product_id", verifyJWT([ROLES.ADMIN]), productAdminController.getSingleProduct)

adminRoutes.post("/change-password", verifyJWT([ROLES.ADMIN]), passwordChangeAdmin)

module.exports = adminRoutes;