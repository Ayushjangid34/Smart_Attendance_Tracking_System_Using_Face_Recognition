const multer = require('multer');
const path = require('path');

// Configuring storage settings
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../studentImages')); // Path to store uploaded files
    },
    filename: function (req, file, cb) {
        const extension = file.originalname.split('.').pop(); // Get file extension
        const userEmail = req.session.email || 'unknown'; // Fallback if userEmail is undefined
        const fileName = `${userEmail}.${extension}`;
        cb(null, fileName);
    },
});

// Configure file filtering
const fileFilter = function (req, file, cb) {
    const allowedExtensions = /jpeg|jpg/;
    const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedExtensions.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true); // Allow file upload
    } else {
        cb(new Error('Only images (jpeg, jpg) are allowed'));
    }
};
// Export the configured Multer instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

module.exports = upload;
