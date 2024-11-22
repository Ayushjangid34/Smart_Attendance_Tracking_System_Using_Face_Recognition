const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authorize = require('../middlewares/authorizationMiddleware');

router.get('/dashboard', authorize(['admin']), adminController.getAdminDashboard);
router.get('/faculty-registration', authorize(['admin']), adminController.getFacultyRegistration);
router.get('/student-registration', authorize(['admin']), adminController.getStudentRegistration);
router.post('/register-student', authorize(['admin']), adminController.registerStudent);
router.post('/register-faculty', authorize(['admin']), adminController.registerFaculty);
router.get('/student-data', authorize(['admin']), adminController.getAllStudents);
router.get('/faculty-data', authorize(['admin']), adminController.getAllFaculties);

module.exports = router;
