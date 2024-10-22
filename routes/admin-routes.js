const express = require("express");
const loginAdminController = require("../controllers/admin/login-admin-controller");

const adminRoutes = express.Router();

adminRoutes.post("/login", loginAdminController);

module.exports = adminRoutes;