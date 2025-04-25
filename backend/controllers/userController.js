// controllers/userController.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');

// Setup multer storage for avatars
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../uploads/avatars');
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Avatar upload directory ensured: ${dir}`);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${req.user._id}-avatar${ext}`;
    console.log("📄 Avatar filename generated:", filename);
    cb(null, filename);
  }
});

const upload = multer({ storage });

// Middleware to handle avatar uploads
const avatarUploadMiddleware = upload.single('avatar');

// Controller to save avatar to user profile
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      console.log("❌ No file uploaded");
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const avatarPath = `/uploads/avatars/${req.file.filename}`;
    console.log("✅ Avatar uploaded, updating user record:", avatarPath);

    await User.findByIdAndUpdate(req.user._id, { avatarUrl: avatarPath });

    res.status(200).json({ avatarUrl: avatarPath });
  } catch (err) {
    console.error('❌ Error uploading avatar:', err);
    res.status(500).json({ message: 'Server error during avatar upload' });
  }
};

module.exports = {
  avatarUploadMiddleware,
  uploadAvatar,
};
