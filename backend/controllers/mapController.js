// 📂 backend/controllers/mapController.js

const path = require('path');
const fs = require('fs');
const Campaign = require('../models/Campaign');

// Save uploaded map file and broadcast it
const uploadMap = async (req, res) => {
  try {
    const campaignId = req.params.id;
    const userId = req.user._id;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    // 🛡 Only GM can upload
    if (campaign.gm.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Only the campaign creator can upload a map.' });
    }

    if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });

    // Save the image path in the campaign document (or you can use a separate Map model)
    const mapPath = `/uploads/maps/${req.file.filename}`;
    campaign.mapUrl = mapPath;
    await campaign.save();

    // Emit socket event (optional — should be handled in the router or socket controller)
    if (req.io) {
      req.io.to(campaignId).emit('map-uploaded', { imageUrl: mapPath });
    }

    res.status(200).json({ message: 'Map uploaded successfully', imageUrl: mapPath });
  } catch (err) {
    console.error('❌ Map upload error:', err);
    res.status(500).json({ message: 'Server error during map upload' });
  }
};

module.exports = {
  uploadMap,
};
