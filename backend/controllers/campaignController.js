const Campaign = require('../models/Campaign');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer storage
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

// Middleware
exports.campaignImageUploadMiddleware = upload.single('image');

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

// Create Campaign
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

// 📂 controllers/campaignController.js

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

