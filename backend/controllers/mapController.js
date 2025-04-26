const Campaign = require('../models/Campaign');

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
