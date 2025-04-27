/**
 * Author: Brandon Trundle
 * File Name: messages.js
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Defines messaging-related routes for ArcanaTable users.
 * Routes include sending messages, retrieving inbox, checking unread message count,
 * marking messages as read, and deleting messages.
 * All routes are protected with JWT authentication middleware.
 */

const express = require('express'); // Express.js web framework
const router = express.Router(); // Express router instance for defining modular routes
const {
  sendMessage,
  getMessages,
  getUnreadMessagesCount,
  markMessageAsRead,
  deleteMessage,
} = require('../controllers/messageController'); // Controller functions for messaging
const { protect } = require('../middleware/authMiddleware'); // Middleware to protect routes with JWT authentication


/**
 * @route   POST /api/messages
 * @desc    Sends a new message from the authenticated user to a recipient.
 * @access  Private (requires JWT authentication)
 */
router.post('/', protect, (req, res, next) => {
  console.log("📨 POST /messages called to send a message");
  console.log("📝 Message data:", req.body);
  next();
}, sendMessage);

/**
 * @route   GET /api/messages
 * @desc    Retrieves all messages received by the authenticated user (inbox).
 * @access  Private (requires JWT authentication)
 */
router.get('/', protect, (req, res, next) => {
  console.log("📨 GET /messages called for user ID:", req.user._id);
  next();
}, getMessages);

/**
 * @route   GET /api/messages/unread
 * @desc    Retrieves the count of unread messages for the authenticated user.
 * @access  Private (requires JWT authentication)
 */
router.get('/unread', protect, (req, res, next) => {
  console.log("📨 GET /messages/unread for user ID:", req.user._id);
  next();
}, getUnreadMessagesCount);

/**
 * @route   PATCH /api/messages/:id/read
 * @desc    Marks a specific message as read.
 * @access  Private (requires JWT authentication)
 */
router.patch('/:id/read', protect, (req, res, next) => {
  console.log(`📨 PATCH /messages/${req.params.id}/read`);
  next();
}, markMessageAsRead);

/**
 * @route   DELETE /api/messages/:id
 * @desc    Deletes a specific message for the authenticated user.
 * @access  Private (requires JWT authentication)
 */
router.delete('/:id', protect, (req, res, next) => {
  console.log(`📨 DELETE /messages/${req.params.id}`);
  next();
}, deleteMessage);

module.exports = router;
