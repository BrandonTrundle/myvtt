const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getUnreadMessagesCount,
  getMessages,
  markMessageAsRead, // ✅ Add this to the import
  deleteMessage,
} = require('../controllers/messageController');
const protect = require('../middleware/authMiddleware');

// Message routes
router.post('/', protect, sendMessage);
router.get('/unread', protect, getUnreadMessagesCount);
router.get('/', protect, getMessages);
router.patch('/:id/read', protect, markMessageAsRead); // ✅ New PATCH route
router.delete('/:id', protect, deleteMessage); // ✅ This line handles the delete

module.exports = router;
