const express = require("express");
const loginSuperAdmin = require("../controllers/super-admin/login-super-admin");

const superAdminRoutes = express.Router();

superAdminRoutes.post('/login', loginSuperAdmin);

module.exports = superAdminRoutes;