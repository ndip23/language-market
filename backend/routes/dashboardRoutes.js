const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { updateProfile, getMyConnections, getTeacherStats  } = require('../controllers/dashboardController');

router.put('/teacher/profile', auth, updateProfile);
router.get('/connections', auth, getMyConnections);
router.get('/teacher/stats', auth, getTeacherStats);


module.exports = router;