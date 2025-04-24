const express = require('express');
const router = express.Router();
const { uploadAvatar, avatarUploadMiddleware } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware'); // ✅ now correct

router.post('/avatar', protect, avatarUploadMiddleware, uploadAvatar);

module.exports = router;
