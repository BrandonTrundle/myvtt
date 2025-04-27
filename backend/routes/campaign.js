/**
 * Author: Brandon Trundle
 * File Name: campaign.js
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Defines campaign-related routes for ArcanaTable users.
 * Routes include creating campaigns, joining campaigns via invite code,
 * retrieving user campaigns, deleting campaigns, uploading campaign images,
 * and fetching specific campaign details.
 * 
 * All routes are protected with JWT authentication middleware.
 */

const express = require('express'); // Express.js web framework
const router = express.Router(); // Express router instance for defining modular routes
const { protect } = require('../middleware/authMiddleware'); // Middleware to protect routes by verifying JWT tokens
const {
  createCampaign,
  getMyCampaigns,
  deleteCampaign,
  uploadCampaignImage,
  campaignImageUploadMiddleware,
  joinCampaignByCode,
  getCampaignById,
} = require('../controllers/campaignController'); // Campaign controller functions

// Debug logs
console.log('createCampaign:', typeof createCampaign); 
console.log('uploadCampaignImage:', typeof uploadCampaignImage);

// Routes
/**
 * @route   POST /campaigns
 * @desc    Creates a new campaign with optional image upload.
 * @access  Private (requires JWT authentication)
 * Middleware: campaignImageUploadMiddleware
 */
router.post('/', protect, campaignImageUploadMiddleware, createCampaign);

/**
 * @route   GET /campaigns/mine
 * @desc    Retrieves campaigns created by or joined by the authenticated user.
 * @access  Private (requires JWT authentication)
 */
router.get('/mine', protect, getMyCampaigns);

/**
 * @route   POST /campaigns/join/:code
 * @desc    Joins an existing campaign using a provided invite code.
 * @access  Private (requires JWT authentication)
 */
router.post('/join/:code', protect, joinCampaignByCode);

/**
 * @route   DELETE /campaigns/:id
 * @desc    Deletes a campaign if the authenticated user is the GM.
 * @access  Private (requires JWT authentication)
 */
router.delete('/:id', protect, deleteCampaign);

/**
 * @route   PATCH /campaigns/:id/image
 * @desc    Uploads or updates the campaign's image.
 * @access  Private (requires JWT authentication)
 * Middleware: campaignImageUploadMiddleware
 */
router.patch('/:id/image', protect, campaignImageUploadMiddleware, uploadCampaignImage);

/**
 * @route   GET /campaigns/:id
 * @desc    Retrieves detailed information for a specific campaign by ID.
 * @access  Private (requires JWT authentication)
 */
router.get('/:id', protect, getCampaignById);


module.exports = router;
