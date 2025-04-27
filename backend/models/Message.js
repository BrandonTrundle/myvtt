/**
 * Author: Brandon Trundle
 * File Name: Message.js
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Defines the Mongoose schema and model for in-app messaging between users in ArcanaTable.
 * Messages can be sent from one user to another, have a subject and body, and can be marked as read.
 */

const mongoose = require('mongoose'); // Mongoose library for MongoDB object modeling

/**
 * Mongoose schema defining the structure of a Message document.
 * 
 * Fields:
 * - sender: ObjectId reference to the User who sent the message (required)
 * - recipient: ObjectId reference to the User who receives the message (required)
 * - subject: String, subject line of the message (required)
 * - body: String, body content of the message (required)
 * - isRead: Boolean indicating whether the message has been read (defaults to false)
 * - sentAt: Date when the message was sent (defaults to now)
 */
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
