const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createCampaign,
  getMyCampaigns,

  deleteCampaign,
  uploadCampaignImage,
  campaignImageUploadMiddleware,
  // joinCampaignByCode,
  
  // getCampaignById,
} = require('../controllers/campaignController');

// Debug logs
console.log('createCampaign:', typeof createCampaign); 
console.log('uploadCampaignImage:', typeof uploadCampaignImage);

// Routes
router.post('/', protect, campaignImageUploadMiddleware, createCampaign);  // ✅ use campaignImageUploadMiddleware
router.get('/mine', protect, getMyCampaigns);
// router.post('/join/:code', protect, joinCampaignByCode);
router.delete('/:id', protect, deleteCampaign);
router.patch('/:id/image', protect, campaignImageUploadMiddleware, uploadCampaignImage); 
// router.get('/:id', protect, getCampaignById);

module.exports = router;
