const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadMap } = require('../controllers/mapController');
const { protect } = require('../middleware/authMiddleware'); // ✅ FIXED

// 🗺 Set up disk storage for uploaded maps
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("✅ Map upload destination set to:", 'uploads/maps');
    cb(null, 'uploads/maps');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix + ext;
    console.log("📄 Generated filename for map upload:", filename);
    cb(null, filename);
  }
});
const upload = multer({ storage });

// 🔐 Protect route and handle upload
router.patch('/:id/map', protect, upload.single('map'), (req, res, next) => {
  console.log(`📨 PATCH /:id/map called for campaign ID: ${req.params.id}`);
  console.log("📄 Uploaded map file:", req.file);
  next();
}, uploadMap);

module.exports = router;
