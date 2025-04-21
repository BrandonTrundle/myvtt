const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Message', messageSchema);
