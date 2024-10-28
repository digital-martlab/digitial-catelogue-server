const dotenv = require("dotenv")

dotenv.config();

module.exports = {
    DB_HOST: "localhost",
    DB_USER: "root",
    DB_PASSWORD: "root",
    DB_NAME: "digital_catelogue_app",
    PORT: 3001,
    JWT_SECRET_KEY: "$2b$12$Rzxx6pFwVvDmYVTMPCzQeeU1/seWXap.kKMQJGYZMA4KypY5s/lvq",
    SALT: 12,
    CLOUDINARY_NAME: "dipgig7oy",
    CLOUDINARY_API_KEY: "342668552755793",
    CLOUDINARY_SECRET_KEY: "AgBtOs9pw9-LFQuYeeP-G_qLgbw",
}