const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadMap } = require('../controllers/mapController');
const { protect } = require('../middleware/authMiddleware'); // ✅ FIXED

// 🗺 Set up disk storage for uploaded maps
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/maps');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage });

// 🔐 Protect route and handle upload
router.patch('/:id/map', protect, upload.single('map'), uploadMap); // ✅ now valid

module.exports = router;
