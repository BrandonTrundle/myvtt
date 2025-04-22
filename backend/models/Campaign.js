const mongoose = require('mongoose');

const generateInviteCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase(); // 6-char alphanumeric
};

const campaignSchema = new mongoose.Schema({
  imageUrl: {
    type: String, // relative path like "/uploads/campaigns/abc123.jpg"
  },
  mapImage: {
    type: String, // base64 string for the live tabletop map
    default: null,
  },
  title: {
    type: String,
    required: true,
  },
  system: {
    type: String,
    required: true,
  },
  module: {
    type: String,
  },
  gm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  inviteCode: {
    type: String,
    unique: true,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate inviteCode automatically before save (if not set)
campaignSchema.pre('validate', async function (next) {
  if (!this.inviteCode) {
    let code;
    let isUnique = false;

    // Loop to ensure uniqueness
    while (!isUnique) {
      code = generateInviteCode();
      const existing = await mongoose.models.Campaign.findOne({ inviteCode: code });
      if (!existing) isUnique = true;
    }

    this.inviteCode = code;
  }

  next();
});

module.exports = mongoose.model('Campaign', campaignSchema);
