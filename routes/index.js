const express = require('express');
const router = express.Router();
const sessionMiddleware = require('../middlewares/sessionMiddleware');

router.use(require('./publicRoutes'));
router.use('/auth', require('./authRoutes'));
router.use('/student', sessionMiddleware, require('./studentRoutes'));
router.use('/faculty', sessionMiddleware, require('./facultyRoutes'));
router.use('/admin', sessionMiddleware, require('./adminRoutes'));

module.exports = router;
