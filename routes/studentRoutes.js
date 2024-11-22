const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const multer = require('../config/multer'); // Multer config
const authorize = require('../middlewares/authorizationMiddleware');

router.get('/dashboard', authorize(['student']), studentController.getStudentDashboard);
router.get('/info', authorize(['student']), studentController.getStudentInfoPage);
router.post(
    '/upload-photo',
    authorize(['student']),
    multer.single('imageFile'),
    studentController.uploadStudentPhoto,
);
router.get('/get-image', authorize(['student']), studentController.getStudentImage);
router.get('/get-info', authorize(['student']), studentController.getStudentInfo); // Based on logged-in student
router.get('/schedule', authorize(['student']), studentController.getStudentSchedule); // Today’s schedule for logged-in student

module.exports = router;
