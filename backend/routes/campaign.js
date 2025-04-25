const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createCampaign,
  getMyCampaigns,
  // joinCampaignByCode,
  deleteCampaign,
  uploadCampaignImage,
  campaignImageUploadMiddleware,
  // getCampaignById,
} = require('../controllers/campaignController');

console.log('createCampaign:', typeof createCampaign); 
console.log('uploadCampaignImage:', typeof uploadCampaignImage);

// Routes
router.post('/', protect, uploadCampaignImage, createCampaign);
router.get('/mine', protect, getMyCampaigns);
// router.post('/join/:code', protect, joinCampaignByCode);
router.delete('/:id', protect, deleteCampaign);
router.patch('/:id/image', protect, campaignImageUploadMiddleware, uploadCampaignImage);
// router.get('/:id', protect, getCampaignById);

module.exports = router;
