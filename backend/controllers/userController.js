const multer = require('multer');
const path = require('path');
const User = require('../models/User');

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/avatars'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user._id}${ext}`);
  }
});

const upload = multer({ storage });

// Middleware to use in route
exports.avatarUploadMiddleware = upload.single('avatar');

// POST /api/user/avatar
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      console.warn('⚠️ No file uploaded');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('📦 File received:', req.file);

    const avatarPath = `/uploads/avatars/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatarUrl: avatarPath },
      { new: true }
    );

    if (!user) {
      console.error('❌ User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ Avatar updated:', user.avatarUrl);
    res.json({ avatarUrl: user.avatarUrl });
  } catch (err) {
    console.error('❌ Upload error:', err);
    res.status(500).json({ message: 'Failed to upload avatar' });
  }
};
