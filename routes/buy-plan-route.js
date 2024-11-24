const planBuyController = require("../controllers/plan-buy-controller");

const buyPlanRoutes = require("express").Router();


buyPlanRoutes.post("/order", planBuyController.createStore);
buyPlanRoutes.post("/verify", planBuyController.paymentVerfication);

module.exports = buyPlanRoutes;