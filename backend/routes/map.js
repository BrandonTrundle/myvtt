const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadMap } = require('../controllers/mapController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Set up multer storage for maps
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

const upload = multer({ 
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 10MB
});


// PATCH /maps/:campaignId/map
router.patch('/:campaignId/map', protect, upload.single('map'), uploadMap);

module.exports = router;
