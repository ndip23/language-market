const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateMe, getMe } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

// @route   POST /api/auth/register
// @desc    Register a user
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    Login a user
router.post('/login', loginUser);
router.put('/update-me', auth, updateMe); 
router.get('/me', auth, getMe); 

module.exports = router;