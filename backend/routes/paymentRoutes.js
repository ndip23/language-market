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
const { handleSwychrWebhook } = require('../controllers/webhookController');

// --- PUBLIC/STUDENT ROUTES ---
router.get('/rate', auth, getExchangeRate);
router.post('/lesson', auth, payForLesson);

// --- TEACHER ROUTES ---
router.post('/subscribe', auth, subscribeTeacher);
router.get('/methods', auth, getMethodsByCountry);
router.post('/withdraw', auth, requestWithdrawal);
router.get('/verify/:transaction_id', auth, verifyPaymentStatus);

// --- WEBHOOK LOGIC ---
router.get('/webhook', (req, res) => {
    // Redirects the user's browser back to the Vercel site
    res.redirect(`${process.env.CLIENT_URL}/dashboard/teacher/subscription?status=success`);
});

router.post('/webhook', handleSwychrWebhook);

module.exports = router;