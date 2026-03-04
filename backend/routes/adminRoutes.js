const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const { updateTeacherStatus, getPlatformStats, getAllTeachersForAdmin, getAdminUsers,   } = require('../controllers/adminController');

router.put('/teacher/:id/status', auth, admin, updateTeacherStatus);
router.get('/stats', auth, admin, getPlatformStats);
router.get('/teachers', auth, admin, getAllTeachersForAdmin);
router.get('/users', auth, admin, getAdminUsers);

module.exports = router;