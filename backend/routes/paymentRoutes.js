const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { paySubscription, payForLesson, swychrWebhook } = require('../controllers/paymentController');

// @route   POST /api/payments/subscribe
// @desc    Teacher pays for $5 or $10 plan
router.post('/subscribe', auth, paySubscription);

// @route   POST /api/payments/lesson
// @desc    Student pays for a lesson
router.post('/lesson', auth, payForLesson);

// @route   POST /api/payments/webhook
// @desc    Swychr calls this behind the scenes
// NOTE: Webhooks should NOT have 'auth' middleware because Swychr is calling it, not a logged-in user!
router.post('/webhook', swychrWebhook);

module.exports = router;