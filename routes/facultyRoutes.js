const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');
const authorize = require('../middlewares/authorizationMiddleware');

router.get('/dashboard', authorize(['faculty']), facultyController.getFacultyDashboard);
router.get('/name', authorize(['faculty']), facultyController.getFacultyName); // Based on logged-in faculty
router.get('/today-schedule', authorize(['faculty']), facultyController.getFacultySchecule);
router.get('/schedule-class', authorize(['faculty']), facultyController.getScheduleClassPage);
router.post('/add-class', authorize(['faculty']), facultyController.addClass);
router.post('/generate-zip', authorize(['faculty']), facultyController.generateAttendanceZip);

module.exports = router;
