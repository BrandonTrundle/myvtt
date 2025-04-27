/**
 * Author: Brandon Trundle
 * File Name: campaignController.js
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Manages campaign creation, retrieval, update, deletion, and joining functionality
 * for ArcanaTable. Handles file uploads for campaign images and maintains
 * campaign-related user permissions (e.g., GM-only operations).
 */


const Campaign = require('../models/Campaign'); // Mongoose model for campaign data
const User = require('../models/User'); // Mongoose model for user data
const multer = require('multer'); // Middleware for handling multipart/form-data (file uploads)
const path = require('path'); // Node.js module for working with file and directory paths
const fs = require('fs'); // Node.js module for filesystem operations


/**
 * Configures Multer storage settings for campaign image uploads.
 * - Saves files to '/uploads/campaigns'
 * - Creates the directory if it does not exist
 * - Uses a unique filename based on timestamp and random number
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/campaigns');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

/**
 * Middleware to handle uploading a single campaign image file.
 * Expects the form-data field name to be 'image'.
 */
exports.campaignImageUploadMiddleware = upload.single('image');


/**
 * Uploads and saves a campaign's image.
 * 
 * @route   PATCH /campaigns/:id/image
 * @access  Private (GM-only)
 * @param   {Object} req - Express request object containing uploaded image file and user data.
 * @param   {Object} res - Express response object used to send the image URL or error message.
 */

exports.uploadCampaignImage = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found.' });
    }

    // ✅ Only GM can upload
    if (String(campaign.gm) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Only the GM can update the image.' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded.' });
    }

    campaign.imageUrl = `/uploads/campaigns/${req.file.filename}`;
    await campaign.save();

    res.json({ imageUrl: campaign.imageUrl });
  } catch (err) {
    console.error('❌ Error uploading campaign image:', err);
    res.status(500).json({ message: 'Server error uploading image.' });
  }
};

/**
 * Creates a new campaign with title, system, and optional module.
 * Assigns the current user as the GM.
 * 
 * @route   POST /campaigns
 * @access  Private
 * @param   {Object} req - Express request object containing campaign details.
 * @param   {Object} res - Express response object used to send new campaign or error.
 */

exports.createCampaign = async (req, res) => {
  try {
    const { title, system, module } = req.body;

    if (!title || !system) {
      return res.status(400).json({ message: 'Title and system are required.' });
    }

    const newCampaign = new Campaign({
      title,
      system,
      module,
      gm: req.user._id,      // ✅ User is the GM
      players: [],           // ✅ No players yet (user is NOT added here)
      inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
    });

    if (req.file) {
      newCampaign.imageUrl = `/uploads/campaigns/${req.file.filename}`;
    }

    await newCampaign.save();

    res.status(201).json(newCampaign);
  } catch (err) {
    console.error('❌ Error creating campaign:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

/**
 * Retrieves all campaigns associated with the current user.
 * Includes campaigns where user is GM and campaigns where user is a player.
 * Adds an `isGM` flag for frontend usage.
 * 
 * @route   GET /campaigns/mine
 * @access  Private
 * @param   {Object} req - Express request object containing authenticated user ID.
 * @param   {Object} res - Express response object used to send list of campaigns.
 */
exports.getMyCampaigns = async (req, res) => {
  try {
    const userId = req.user._id;

    // Campaigns where user is the GM
    const gmCampaigns = await Campaign.find({ gm: userId })
      .populate('gm', 'displayName avatarUrl')
      .populate('players', 'displayName avatarUrl')
      .lean();

    // Campaigns where user is a player but not the GM
    const playerCampaigns = await Campaign.find({
      players: userId,
      gm: { $ne: userId }
    })
      .populate('gm', 'displayName avatarUrl')
      .populate('players', 'displayName avatarUrl')
      .lean();

    // Add isGM flag to help frontend
    const allCampaigns = [
      ...gmCampaigns.map(c => ({ ...c, isGM: true })),
      ...playerCampaigns.map(c => ({ ...c, isGM: false })),
    ];

    res.json(allCampaigns);
  } catch (err) {
    console.error('❌ Error fetching campaigns:', err);
    res.status(500).json({ message: 'Server error fetching campaigns.' });
  }
};

/**
 * Deletes a campaign if the current user is the GM.
 * 
 * @route   DELETE /campaigns/:id
 * @access  Private (GM-only)
 * @param   {Object} req - Express request object containing campaign ID.
 * @param   {Object} res - Express response object used to confirm deletion or return error.
 */
exports.deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found.' });
    }

    // ✅ Only GM can delete
    if (String(campaign.gm) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Only the GM can delete this campaign.' });
    }

    await campaign.deleteOne();

    res.json({ message: 'Campaign deleted successfully.' });
  } catch (err) {
    console.error('❌ Error deleting campaign:', err);
    res.status(500).json({ message: 'Server error deleting campaign.' });
  }
};

/**
 * Retrieves detailed campaign information by campaign ID.
 * Includes populated GM and player display names and avatars.
 * 
 * @route   GET /campaigns/:id
 * @access  Private
 * @param   {Object} req - Express request object containing campaign ID.
 * @param   {Object} res - Express response object used to send campaign data or error.
 */
exports.getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('gm', 'displayName avatarUrl')
      .populate('players', 'displayName avatarUrl');

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    res.json(campaign);
  } catch (err) {
    console.error('❌ Error getting campaign by ID:', err);
    res.status(500).json({ message: 'Server error fetching campaign.' });
  }
};

/**
 * Allows a user to join a campaign using an invite code.
 * Validates if user is already a GM or player before adding them.
 * 
 * @route   POST /campaigns/join/:code
 * @access  Private
 * @param   {Object} req - Express request object containing invite code and user ID.
 * @param   {Object} res - Express response object used to confirm joining or return error.
 */
exports.joinCampaignByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const userId = req.user._id;

    const campaign = await Campaign.findOne({ inviteCode: code });

    if (!campaign) {
      return res.status(404).json({ message: 'Invalid invite code.' });
    }

    // Check if already GM
    if (String(campaign.gm) === String(userId)) {
      return res.status(400).json({ message: 'You are the GM of this campaign.' });
    }

    // Check if already a player
    if (campaign.players.includes(userId)) {
      return res.status(400).json({ message: 'You are already a player in this campaign.' });
    }

    // Add player
    campaign.players.push(userId);
    await campaign.save();

    res.json({ message: 'Successfully joined campaign!', campaign });
  } catch (err) {
    console.error('❌ Error joining campaign by code:', err);
    res.status(500).json({ message: 'Server error joining campaign.' });
  }
};

