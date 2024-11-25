const dotenv = require("dotenv")

dotenv.config();

module.exports = {
    DB_HOST: "35.154.28.45",
    // DB_HOST: "localhost",
    DB_USER: "new-db",
    // DB_USER: "root",
    DB_PASSWORD: "123@123@123",
    DB_PASSWORD: "root",
    DB_NAME: "digital_catelogue_app",
    PORT: 3001,
    JWT_SECRET_KEY: "$2b$12$Rzxx6pFwVvDmYVTMPCzQeeU1/seWXap.kKMQJGYZMA4KypY5s/lvq",
    SALT: 12,
    CLOUDINARY_NAME: "dipgig7oy",
    CLOUDINARY_API_KEY: "342668552755793",
    CLOUDINARY_SECRET_KEY: "AgBtOs9pw9-LFQuYeeP-G_qLgbw",
    EMAIL_HOST: "smtp.hostinger.com",
    EMAIL_PORT: 465,
    EMAIL: "info@digitalmartlab.in",
    APP_PASSWORD: "Digitalmartlab@5437.",
    RAZORPAY_KEY_ID: "rzp_test_9BX9JRxog6rHRw",
    RAZORPAY_KEY_SECRET: 'tohJJE9bVQnf7KJXyqo949oI'
}