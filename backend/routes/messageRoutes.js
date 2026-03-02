const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { sendMessage, getMessages, markAsRead, getUnreadCounts } = require('../controllers/messageController');

// All messaging routes are protected by auth
router.post('/', auth, sendMessage);
router.get('/:otherUserId', auth, getMessages);
router.put('/read/:senderId', auth, markAsRead);
router.get('/unread/count', auth, getUnreadCounts);

module.exports = router;