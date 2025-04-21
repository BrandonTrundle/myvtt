const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  race: { type: String },
  class: { type: String },
  background: { type: String },
  level: { type: Number, default: 1 },
  stats: {
    str: Number,
    dex: Number,
    con: Number,
    int: Number,
    wis: Number,
    cha: Number,
  },
  avatarUrl: { type: String },
  backstory: { type: String },
  system: { type: String, default: '5E' },
  isPublic: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Character', characterSchema);
