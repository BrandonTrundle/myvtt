const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/authMiddleware');

// Get all messages for a campaign
router.get('/:campaignId', protect, async (req, res) => {
  console.log(`📨 GET /:campaignId hit for campaign ID: ${req.params.campaignId}`);

  try {
    const messages = await Message.find({ campaignId: req.params.campaignId }).sort({ createdAt: 1 });
    console.log("✅ Messages fetched for campaign:", messages.length);
    res.json(messages);
  } catch (err) {
    console.error('❌ Error fetching messages:', err);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

// Send a new message
router.post('/:campaignId', protect, async (req, res) => {
  console.log(`📨 POST /:campaignId hit to send a new message for campaign ID: ${req.params.campaignId}`);

  try {
    const newMessage = new Message({
      campaignId: req.params.campaignId,
      sender: req.user._id,
      content: req.body.content,
    });

    await newMessage.save();
    console.log("✅ New message sent by user:", req.user._id);
    res.status(201).json(newMessage);
  } catch (err) {
    console.error('❌ Error creating message:', err);
    res.status(400).json({ message: 'Failed to create message' });
  }
});

// Mark message as read
router.patch('/:messageId/read', protect, async (req, res) => {
  console.log(`📨 PATCH /:messageId/read hit to mark message ID: ${req.params.messageId} as read`);

  try {
    const message = await Message.findByIdAndUpdate(
      req.params.messageId,
      { $addToSet: { readBy: req.user._id } },
      { new: true }
    );

    if (!message) {
      console.log("❌ Message not found:", req.params.messageId);
      return res.status(404).json({ message: 'Message not found' });
    }

    console.log("✅ Message marked as read by user:", req.user._id);
    res.json(message);
  } catch (err) {
    console.error('❌ Error marking message as read:', err);
    res.status(400).json({ message: 'Failed to update message' });
  }
});

module.exports = router;
