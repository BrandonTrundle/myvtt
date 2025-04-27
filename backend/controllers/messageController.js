/**
 * Author: Brandon Trundle
 * File Name: messageController.js
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Handles user messaging functionality for ArcanaTable.
 * Provides endpoints to:
 *  - Send messages between users
 *  - Retrieve all messages for a user
 *  - Count unread messages
 *  - Mark messages as read
 *  - Delete messages
 */

const Message = require('../models/Message'); // Mongoose model for storing and retrieving messages
const User = require('../models/User'); // Mongoose model for user information


/**
 * Sends a message from the logged-in user to a recipient by username.
 * 
 * @route   POST /messages/send
 * @access  Private
 * @param   {Object} req - Express request object containing:
 *                         - req.body.toUsername: Recipient's display name
 *                         - req.body.subject: Subject of the message
 *                         - req.body.body: Body content of the message
 * @param   {Object} res - Express response object used to send the new message data or an error.
 * 
 * @throws  404 if recipient is not found.
 * @throws  500 on server error.
 */
exports.sendMessage = async (req, res) => {
  try {
    const { toUsername, subject, body } = req.body;

    const recipient = await User.findOne({ displayName: toUsername });

    if (!recipient) {
      console.warn(`❌ Recipient not found: ${toUsername}`);
      return res.status(404).json({ message: 'Recipient not found' });
    }

    const newMessage = new Message({
      sender: req.user._id,
      recipient: recipient._id,
      subject,
      body,
    });

    await newMessage.save();

    console.log(`✅ Message sent from ${req.user._id} to ${recipient._id}`);
    res.status(201).json(newMessage);
  } catch (err) {
    console.error('❌ Error sending message:', err);
    res.status(500).json({ message: 'Failed to send message' });
  }
};

/**
 * Retrieves all messages sent to the logged-in user, sorted by most recent.
 * 
 * @route   GET /messages
 * @access  Private
 * @param   {Object} req - Express request object containing user ID.
 * @param   {Object} res - Express response object used to send list of messages or error.
 * 
 * @throws  500 on server error.
 */
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ recipient: req.user._id })
      .populate('sender', 'displayName')
      .sort({ sentAt: -1 });

    res.json(messages);
  } catch (err) {
    console.error('❌ Error fetching messages:', err);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};

/**
 * Retrieves the count of unread messages for the logged-in user.
 * 
 * @route   GET /messages/unread
 * @access  Private
 * @param   {Object} req - Express request object containing user ID.
 * @param   {Object} res - Express response object used to send unread count or error.
 * 
 * @throws  500 on server error.
 */
exports.getUnreadMessagesCount = async (req, res) => {
  try {
    // Log the recipient user ID to verify the request is correct
    console.log('Recipient user ID:', req.user._id);

    const count = await Message.countDocuments({
      recipient: req.user._id,
      isRead: false,
    });

    // Log the actual count
    console.log('Unread messages count:', count);

    res.json({ unread: count });
  } catch (err) {
    console.error('❌ Error counting unread messages:', err);
    res.status(500).json({ message: 'Failed to count messages' });
  }
};

/**
 * Marks a specific message as read by the logged-in user.
 * 
 * @route   PATCH /messages/:id/read
 * @access  Private
 * @param   {Object} req - Express request object containing:
 *                         - req.params.id: ID of the message to mark as read
 * @param   {Object} res - Express response object used to send updated message data or error.
 * 
 * @throws  404 if message is not found.
 * @throws  500 on server error.
 */
exports.markMessageAsRead = async (req, res) => {
  try {
    const message = await Message.findOneAndUpdate(
      {
        _id: req.params.id,
        recipient: req.user._id,
      },
      { isRead: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json(message);
  } catch (err) {
    console.error('❌ Error marking message as read:', err);
    res.status(500).json({ message: 'Failed to update message' });
  }
};

/**
 * Deletes a specific message for the logged-in user.
 * 
 * @route   DELETE /messages/:id
 * @access  Private
 * @param   {Object} req - Express request object containing:
 *                         - req.params.id: ID of the message to delete
 * @param   {Object} res - Express response object used to confirm deletion or return error.
 * 
 * @throws  404 if message is not found.
 * @throws  500 on server error.
 */
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user._id,
    });

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({ message: 'Message deleted' });
  } catch (err) {
    console.error('❌ Error deleting message:', err);
    res.status(500).json({ message: 'Failed to delete message' });
  }
};
