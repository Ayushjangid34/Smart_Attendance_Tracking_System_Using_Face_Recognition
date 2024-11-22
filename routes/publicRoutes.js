const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');
const checkSessionMiddleware = require('../middlewares/checkSessionMiddleware');

router.get('/', checkSessionMiddleware, publicController.getHomePage);
router.get('/about', publicController.getAboutPage);
router.get('/admin-login', publicController.getAdminLoginPage);
router.get('/faculty-login', publicController.getFacultyLoginPage);
router.get('/student-login', publicController.getStudentLoginPage);
router.get('/contact', publicController.getContactUsPage);
router.post('/get-help', publicController.saveRequestDetails);

module.exports = router;
