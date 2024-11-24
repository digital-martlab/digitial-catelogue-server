const express = require("express");
const loginSuperAdminController = require("../controllers/super-admin/login-super-admin-controller");
const storesAdminController = require("../controllers/super-admin/stores-super-admin-controller");
const verifyJWT = require("../middlewares/auth-middleware");
const { ROLES } = require("../config/roles-config");
const superAdminDashboard = require("../controllers/super-admin/super-admin-dashboard");
const superAdminPlanController = require("../controllers/super-admin/super-admin-plan-controller");


const superAdminRoutes = express.Router();

superAdminRoutes.post('/login', loginSuperAdminController);

// Authentication
superAdminRoutes.route('/plan').get(superAdminPlanController.getPlans);
superAdminRoutes.use(verifyJWT([ROLES.SUPER_ADMIN]));
superAdminRoutes.get('/dashboard', superAdminDashboard);
superAdminRoutes.route('/store')
    .post(storesAdminController.createStore)
    .get(storesAdminController.getAllStores)
    .delete(storesAdminController.deleteStore)

superAdminRoutes.route('/store/:store_id')
    .get(storesAdminController.getSingleStore)
    .post(storesAdminController.updateStoreActiveStatus)
    .patch(storesAdminController.updateStore)

superAdminRoutes.route('/plan')
    .get(superAdminPlanController.getPlans)
    .post(superAdminPlanController.createPlan)
    .patch(superAdminPlanController.updatePlan)
    .delete(superAdminPlanController.deletePlan)

module.exports = superAdminRoutes;