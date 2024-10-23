const express = require("express");
const loginAdminController = require("../controllers/admin/login-admin-controller");
const categoryAdminController = require("../controllers/admin/category-admin-controller");
const verifyJWT = require("../middlewares/auth-middleware");
const { ROLES } = require("../config/roles-config");
const couponAdminController = require("../controllers/admin/coupon-admin-controller");

const adminRoutes = express.Router();

adminRoutes.post("/login", loginAdminController);

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

module.exports = adminRoutes;