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
const adminThemeController = require("../controllers/admin/admin-theme-controller");
const resetPasswordController = require("../controllers/admin/reset-password-controller");
const profileAdminController = require("../controllers/admin/profile-admin-controller");

const adminRoutes = express.Router();

adminRoutes.post("/login", loginAdminController);
adminRoutes.post("/forgot-password", resetPasswordController.sendResetMail);
adminRoutes.post("/reset-password", resetPasswordController.resetPassword);

adminRoutes.use(verifyJWT([ROLES.ADMIN]))
adminRoutes.get("/dashboard", adminDashboardController);

adminRoutes.route("/category")
    .post(categoryAdminController.createCategory)
    .get(categoryAdminController.getAllCategory)
    .patch(categoryAdminController.updateCategory)
    .delete(categoryAdminController.deleteCategory);

adminRoutes.route("/coupon")
    .post(couponAdminController.createCoupon)
    .get(couponAdminController.getAllCoupons)
    .patch(couponAdminController.updateCoupon)
    .delete(couponAdminController.deleteCoupon);

adminRoutes.route("/gallery")
    .post(galleryAdminController.uploadImages)
    .get(galleryAdminController.getAllImages)
    .delete(galleryAdminController.deleteImage);

adminRoutes.route("/product")
    .post(productAdminController.createProduct)
    .get(productAdminController.getAllProducts)
    .put(productAdminController.productActiveStatus)
    .delete(productAdminController.deleteProduct)
    .patch(productAdminController.updateProduct);

adminRoutes.route("/theme")
    .get(adminThemeController.getTheme)
    .patch(adminThemeController.updateTheme);

adminRoutes.patch("/profile", profileAdminController.updateProfile);
adminRoutes.get("/product/:product_id", productAdminController.getSingleProduct)

adminRoutes.post("/change-password", passwordChangeAdmin)

module.exports = adminRoutes;