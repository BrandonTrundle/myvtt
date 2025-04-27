/**
 * Author: Brandon Trundle
 * File Name: mapController.js
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Handles uploading and associating map files with campaigns in ArcanaTable.
 * Provides functionality to upload a new map image and set it as the active map
 * for a specific campaign.
 */

const Campaign = require('../models/Campaign'); // Mongoose model for campaign data

/**
 * Uploads a map image file and sets it as the active map for a specific campaign.
 * 
 * @route   POST /maps/upload/:campaignId
 * @access  Private (must be authenticated and authorized in middleware chain)
 * @param   {Object} req - Express request object containing:
 *                         - req.params.campaignId: ID of the campaign to update
 *                         - req.file: Uploaded map file
 * @param   {Object} res - Express response object used to send success message and map URL or error.
 * 
 * @throws  400 if no file is uploaded.
 * @throws  404 if campaign is not found.
 * @throws  500 on server error.
 */

exports.uploadMap = async (req, res) => {
  try {
    const campaignId = req.params.campaignId;

    if (!req.file) {
      return res.status(400).json({ message: 'No map file uploaded.' });
    }

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found.' });
    }

    // ✅ Save the uploaded file path to campaign.activeMap
    campaign.activeMap = `/uploads/maps/${req.file.filename}`;
    await campaign.save();

    console.log(`✅ Map uploaded and active for campaign: ${campaignId}`);
    console.log(`✅ Map uploaded: ${req.file.filename}, size: ${req.file.size} bytes`);
    res.status(200).json({ activeMap: campaign.activeMap });
  } catch (err) {
    console.error('❌ Error uploading map:', err);
    res.status(500).json({ message: 'Server error uploading map.' });
  }
};
