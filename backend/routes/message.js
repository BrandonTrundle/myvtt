const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getUnreadMessagesCount,
  getMessages,
  markMessageAsRead, // ✅ Add this to the import
  deleteMessage,
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware'); // ✅ grabs the actual function

// Message routes
router.post('/', protect, (req, res, next) => {
  console.log("📨 POST /messages called to send a message");
  console.log("📝 Message data:", req.body);
  next();
}, sendMessage);

router.get('/unread', protect, (req, res, next) => {
  console.log("📨 GET /messages/unread called for user ID:", req.user._id);
  next();
}, getUnreadMessagesCount);

router.get('/', protect, (req, res, next) => {
  console.log("📨 GET /messages called for user ID:", req.user._id);
  next();
}, getMessages);

router.patch('/:id/read', protect, (req, res, next) => {
  console.log("📨 PATCH /messages/:id/read called for message ID:", req.params.id);
  next();
}, markMessageAsRead);

router.delete('/:id', protect, (req, res, next) => {
  console.log("📨 DELETE /messages/:id called for message ID:", req.params.id);
  next();
}, deleteMessage);

module.exports = router;
