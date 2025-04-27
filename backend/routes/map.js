/**
 * Author: Brandon Trundle
 * File Name: map.js
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Defines map upload routes for ArcanaTable campaigns.
 * Handles setting up Multer storage for map images and uploading maps
 * associated with specific campaigns. All routes are protected with JWT authentication.
 */

const express = require('express'); // Express.js web framework
const multer = require('multer'); // Middleware for handling multipart/form-data (file uploads)
const path = require('path'); // Node.js core module for handling file and directory paths
const { uploadMap } = require('../controllers/mapController'); // Controller function for uploading maps
const { protect } = require('../middleware/authMiddleware'); // Middleware to protect routes with JWT authentication
const router = express.Router();

/**
 * Configures Multer storage settings for uploaded map images.
 * - Saves files to '/uploads/maps'
 * - Names files uniquely based on timestamp and random number
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../uploads/maps');
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = `map-${uniqueSuffix}${ext}`;
    cb(null, filename);
  }
});

/**
 * Initializes Multer with configured storage and sets a maximum file size limit.
 * - Maximum file size: 25MB
 */
const upload = multer({ 
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 10MB
});


/**
 * @route   PATCH /maps/:campaignId/map
 * @desc    Uploads a new map image for a specific campaign.
 * @access  Private (requires JWT authentication)
 * Middleware: Single file upload with field name 'map'
 */
router.patch('/:campaignId/map', protect, upload.single('map'), uploadMap);

module.exports = router;
