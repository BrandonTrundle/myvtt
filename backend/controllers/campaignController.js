const path = require('path');
const fs = require('fs');
const Campaign = require('../models/Campaign');

// Create a new campaign
const createCampaign = async (req, res) => {
  try {
    const { title, system, module } = req.body;

    if (!title || !system) {
      return res.status(400).json({ message: 'Title and system are required.' });
    }

    const campaign = new Campaign({
      title,
      system,
      module,
      gm: req.user._id, // Set the GM as the logged-in user
    });

    await campaign.save();

    res.status(201).json(campaign);
  } catch (err) {
    console.error('❌ Error creating campaign:', err);
    res.status(500).json({ message: 'Server error while creating campaign.' });
  }
};

// Join a campaign by invite code
const joinCampaignByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const userId = req.user._id;

    const campaign = await Campaign.findOne({ inviteCode: code });

    if (!campaign) {
      return res.status(404).json({ message: 'Invalid invite code.' });
    }

    if (campaign.gm.toString() === userId.toString()) {
      return res.status(400).json({ message: 'You are already the GM of this campaign.' });
    }

    if (campaign.players.includes(userId)) {
      return res.status(400).json({ message: 'You have already joined this campaign.' });
    }

    campaign.players.push(userId);
    await campaign.save();

    res.status(200).json({ message: 'Successfully joined campaign.', campaign });
  } catch (err) {
    console.error('❌ Error joining campaign:', err);
    res.status(500).json({ message: 'Server error while joining campaign.' });
  }
};

// Get campaigns where user is GM or player
const getMyCampaigns = async (req, res) => {
  try {
    const userId = req.user._id;

    const campaigns = await Campaign.find({
      $or: [{ gm: userId }, { players: userId }],
    }).lean();

    const tagged = campaigns.map((campaign) => ({
      ...campaign,
      isGM: campaign.gm.toString() === userId.toString(),
    }));

    res.json(tagged);
  } catch (err) {
    console.error('❌ Error fetching campaigns:', err);
    res.status(500).json({ message: 'Server error fetching campaigns.' });
  }
};

const deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const campaign = await Campaign.findById(id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found.' });
    }

    if (campaign.gm.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Only the GM can delete this campaign.' });
    }

    await campaign.deleteOne();

    res.json({ message: 'Campaign deleted successfully.' });
  } catch (err) {
    console.error('❌ Error deleting campaign:', err);
    res.status(500).json({ message: 'Server error while deleting campaign.' });
  }
};

const uploadCampaignImage = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found.' });
    }

    if (campaign.gm.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the GM can upload an image.' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded.' });
    }

    // Create path like /uploads/campaigns/filename.jpg
    const relativePath = `/uploads/campaigns/${req.file.filename}`;
    campaign.imageUrl = relativePath;
    await campaign.save();

    res.status(200).json({ imageUrl: relativePath });
  } catch (err) {
    console.error('❌ Error uploading campaign image:', err);
    res.status(500).json({ message: 'Server error uploading image.' });
  }
};


module.exports = {
  createCampaign,
  joinCampaignByCode,
  getMyCampaigns,
  deleteCampaign,
  uploadCampaignImage,
};
