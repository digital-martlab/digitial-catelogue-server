const multer = require("multer");

// Configure storage options
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/'); // Directory to save uploaded files
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname);
//     }
// });

const storage = multer.memoryStorage();

// Initialize multer with storage options
const upload = multer({
    storage: storage,
    limits: { fileSize: 500 * 1024 }
});

module.exports = upload;