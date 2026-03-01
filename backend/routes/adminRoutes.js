const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const { updateTeacherStatus, getPlatformStats, getAllTeachersForAdmin  } = require('../controllers/adminController');

router.put('/teacher/:id/status', auth, admin, updateTeacherStatus);
router.get('/stats', auth, admin, getPlatformStats);
router.get('/teachers', auth, admin, getAllTeachersForAdmin);

module.exports = router;