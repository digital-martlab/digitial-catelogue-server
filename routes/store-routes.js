const express = require("express");
const storeInfoController = require("../controllers/store/store-info-controller");
const storeProductController = require("../controllers/store/store-product-controller");
const couponStoreController = require("../controllers/store/coupon-store-controller");
const storeOrderController = require("../controllers/store/store-order-controller");

const storeRoutes = express.Router();

storeRoutes.get("/:store_slug", storeInfoController.getStoreInfo);
storeRoutes.route("/products/:acc_id")
    .get(storeProductController.getAllProducts)
storeRoutes.route("/coupon/:acc_id").get(couponStoreController.applyCoupon);
storeRoutes.route("/order").post(storeOrderController.createOrder);

module.exports = storeRoutes;