const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authorize = require('../middlewares/authorizationMiddleware');
const sessionMiddleware = require('../middlewares/sessionMiddleware');

router.get(
    '/change-password',
    sessionMiddleware,
    authorize(['student', 'faculty']),
    authController.getChangePasswordPage,
);
router.post('/admin-login', authController.adminLogin);
router.post('/faculty-login', authController.facultyLogin);
router.post('/student-login', authController.studentLogin);
router.post(
    '/commit-change',
    sessionMiddleware,
    authorize(['student', 'faculty']),
    authController.changePassword,
);

module.exports = router;
