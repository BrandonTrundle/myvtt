const Message = require('../models/Message');
const User = require('../models/User');


const sendMessage = async (req, res) => {
  try {
    const { toUsername, subject, body } = req.body;

    if (!toUsername || !subject || !body) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // Find the recipient by username
    const recipient = await User.findOne({ displayName: toUsername });

    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found.' });
    }

    const message = new Message({
      sender: req.user._id,
      recipient: recipient._id,
      subject,
      body,
    });

    await message.save();

    res.status(201).json({ message: 'Message sent successfully.' });
  } catch (err) {
    console.error('❌ Error sending message:', err);
    res.status(500).json({ message: 'Server error while sending message.' });
  }
};

const getUnreadMessagesCount = async (req, res) => {
    try {
      const userId = req.user._id;
  
      const count = await Message.countDocuments({
        recipient: userId,
        isRead: false,
      });
  
      res.json({ unread: count });
    } catch (err) {
      console.error('❌ Error checking unread messages:', err);
      res.status(500).json({ message: 'Failed to check unread messages.' });
    }
  };

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ recipient: req.user._id })
      .sort({ sentAt: -1 }) // newest first
      .populate('sender', 'displayName'); // only get sender's name

    const formatted = messages.map((msg) => ({
      _id: msg._id,
      senderName: msg.sender.displayName || 'Unknown',
      subject: msg.subject,
      body: msg.body,
      isRead: msg.isRead,
      sentAt: msg.sentAt,
    }));

    res.json(formatted);
  } catch (err) {
    console.error('❌ Error getting messages:', err);
    res.status(500).json({ message: 'Failed to fetch messages.' });
  }
};

const markMessageAsRead = async (req, res) => {
    try {
      const { id } = req.params;
  
      const message = await Message.findById(id);
  
      if (!message) {
        return res.status(404).json({ message: 'Message not found.' });
      }
  
      if (message.recipient.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to mark this message.' });
      }
  
      if (!message.isRead) {
        message.isRead = true;
        await message.save();
      }
  
      res.status(200).json({ message: 'Message marked as read.' });
    } catch (err) {
      console.error('❌ Error marking message as read:', err);
      res.status(500).json({ message: 'Failed to update message.' });
    }
  };

  const deleteMessage = async (req, res) => {
    try {
      const message = await Message.findById(req.params.id);
  
      if (!message) {
        return res.status(404).json({ message: 'Message not found.' });
      }
  
      if (message.recipient.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this message.' });
      }
  
      await message.deleteOne();
      res.status(200).json({ message: 'Message deleted.' });
    } catch (err) {
      console.error('❌ Error deleting message:', err);
      res.status(500).json({ message: 'Failed to delete message.' });
    }
  };



module.exports = {
  sendMessage,
  getUnreadMessagesCount,
  getMessages,
  markMessageAsRead,
  deleteMessage,
};
