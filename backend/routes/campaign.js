const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // ✅ You missed this import for mkdirSync
const { protect } = require('../middleware/authMiddleware'); // ✅ now you're importing the actual function


const {
  createCampaign,
  getMyCampaigns,
  joinCampaignByCode,
  deleteCampaign,
  uploadCampaignImage,
  getCampaignById,
} = require('../controllers/campaignController');

// Setup multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '..', 'uploads', 'campaigns');
    fs.mkdirSync(dir, { recursive: true }); // ensure folder exists
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e6);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});
const upload = multer({ storage });

// Routes
router.post('/', protect, createCampaign);
router.get('/mine', protect, getMyCampaigns);
router.post('/join/:code', protect, joinCampaignByCode);
router.delete('/:id', protect, deleteCampaign);
router.patch('/:id/image', protect, upload.single('image'), uploadCampaignImage); // ✅ Move this above export
router.get('/:id', protect, getCampaignById);

module.exports = router;
