// 📂 routes/message.js
const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getMessages,
  getUnreadMessagesCount,
  markMessageAsRead,
  deleteMessage,
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// 📨 POST /api/messages - Send a message
router.post('/', protect, (req, res, next) => {
  console.log("📨 POST /messages called to send a message");
  console.log("📝 Message data:", req.body);
  next();
}, sendMessage);

// 📨 GET /api/messages - Fetch inbox
router.get('/', protect, (req, res, next) => {
  console.log("📨 GET /messages called for user ID:", req.user._id);
  next();
}, getMessages);

// 📨 GET /api/messages/unread - Get unread message count
router.get('/unread', protect, (req, res, next) => {
  console.log("📨 GET /messages/unread for user ID:", req.user._id);
  next();
}, getUnreadMessagesCount);

// 📨 PATCH /api/messages/:id/read - Mark as read
router.patch('/:id/read', protect, (req, res, next) => {
  console.log(`📨 PATCH /messages/${req.params.id}/read`);
  next();
}, markMessageAsRead);

// 📨 DELETE /api/messages/:id - Delete message
router.delete('/:id', protect, (req, res, next) => {
  console.log(`📨 DELETE /messages/${req.params.id}`);
  next();
}, deleteMessage);

module.exports = router;
