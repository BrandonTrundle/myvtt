// routes/user.js
const express = require('express');
const router = express.Router();
const { uploadAvatar, avatarUploadMiddleware } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');


console.log("uploadAvatar:", uploadAvatar);
console.log("avatarUploadMiddleware:", avatarUploadMiddleware);
router.post('/avatar', protect, avatarUploadMiddleware, uploadAvatar);

module.exports = router;
