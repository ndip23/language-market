const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { 
    subscribeTeacher, 
    getExchangeRate, 
    payForLesson, 
    getMethodsByCountry, 
    requestWithdrawal,
    verifyPaymentStatus
} = require('../controllers/paymentController');

// --- PUBLIC/STUDENT ROUTES ---
router.get('/rate', auth, getExchangeRate); // Get local price
router.post('/lesson', auth, payForLesson); // Student pays teacher

// --- TEACHER ROUTES ---
router.post('/subscribe', auth, subscribeTeacher); // Teacher pays sub
router.get('/methods', auth, getMethodsByCountry); // Get local banks/momo
router.post('/withdraw', auth, requestWithdrawal); // Teacher takes money out
router.get('/verify/:transaction_id', auth, verifyPaymentStatus);

module.exports = router;