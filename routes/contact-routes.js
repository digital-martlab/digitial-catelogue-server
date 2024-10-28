const express = require('express');
const contactUsController = require('../controllers/contact-us-controller');
const verifyJWT = require('../middlewares/auth-middleware');
const { ROLES } = require('../config/roles-config');
const contactRoutes = express.Router();

contactRoutes.post("/contact", contactUsController.createContact);
contactRoutes.use("/contact", verifyJWT([ROLES.SUPER_ADMIN]))
contactRoutes.route('/contact')
    .get(contactUsController.getContacts)
    .delete(contactUsController.deleteContact);

module.exports = contactRoutes;
