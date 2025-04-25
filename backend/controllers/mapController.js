const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Set up Multer storage for campaign maps
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../uploads/campaigns');
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Directory ensured: ${dir}`);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `image-${Date.now()}-${Math.floor(Math.random() * 1000000)}${ext}`;
    console.log("📄 Generated filename:", filename);
    cb(null, filename);
  },
});

const upload = multer({ storage });

// Upload map image
router.post('/upload', protect, upload.single('map'), async (req, res) => {
  console.log("📨 POST /upload - Map image");

  try {
    if (!req.file) {
      console.log("❌ No map file uploaded");
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/campaigns/${req.file.filename}`;
    console.log("✅ Map uploaded:", fileUrl);
    res.status(201).json({ fileUrl });
  } catch (err) {
    console.error('❌ Upload failed:', err);
    res.status(500).json({ message: 'Failed to upload map' });
  }
});

module.exports = router;
