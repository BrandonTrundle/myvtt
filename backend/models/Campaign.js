/**
 * Author: Brandon Trundle
 * File Name: Campaign.js
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Defines the Mongoose schema and model for campaigns in ArcanaTable.
 * A campaign contains metadata like title, system, GM reference, players, invite codes,
 * and associated map files. An invite code is automatically generated if not provided.
 */


const mongoose = require('mongoose'); // Mongoose library for MongoDB object modeling

/**
 * Mongoose schema defining the structure of a Campaign document.
 * 
 * Fields:
 *  - imageUrl: String, path to uploaded campaign image
 *  - mapImage: String, base64 live tabletop map
 *  - activeMap: String, path to the currently active map
 *  - title: String, required campaign title
 *  - system: String, required RPG system (e.g., "D&D 5e")
 *  - module: String, optional module or adventure name
 *  - gm: ObjectId reference to User (the Game Master)
 *  - players: Array of ObjectId references to Users
 *  - inviteCode: Unique string code for joining the campaign
 *  - createdAt: Date when the campaign was created
 */
const campaignSchema = new mongoose.Schema({
  imageUrl: {
    type: String, // relative path like "/uploads/campaigns/abc123.jpg"
  },
  mapImage: {
    type: String, // base64 string for the live tabletop map
    default: null,
  },
  activeMap: {
    type: String, // Store the path for the active map
    default: '',   // Empty string initially, will be populated once a map is uploaded
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

/**
 * Pre-validation middleware to automatically generate a unique inviteCode
 * if one is not manually set before saving a Campaign document.
 * 
 * Ensures no duplicate invite codes exist in the database.
 * 
 * @param {Function} next - Callback to proceed to the next middleware or save operation.
 */
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
