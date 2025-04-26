// 📂 controllers/messageController.js
const Message = require('../models/Message');
const User = require('../models/User');

// 📨 Send a message
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

// 📨 Get all messages for logged-in user
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

// 📨 Count unread messages
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

// 📨 Mark a message as read
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

// 📨 Delete a message
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
