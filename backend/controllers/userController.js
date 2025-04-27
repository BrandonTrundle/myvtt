/**
 * Author: Brandon Trundle
 * File Name: userController.js
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Manages user-related operations for ArcanaTable.
 * Provides functionality to upload and save user avatar images,
 * updating the user's profile with the uploaded avatar URL.
 */

const multer = require('multer'); // Middleware for handling multipart/form-data (file uploads)
const path = require('path'); // Node.js core module for handling file and directory paths
const fs = require('fs'); // Node.js core module for interacting with the file system
const User = require('../models/User'); // Mongoose model for user data

/**
 * Configures Multer storage settings for user avatar uploads.
 * - Saves files to '/uploads/avatars'
 * - Creates the directory if it does not exist
 * - Generates a filename based on user ID and avatar suffix
 */
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

/**
 * Middleware to handle single avatar file upload.
 * Expects the form-data field name to be 'avatar'.
 */
const avatarUploadMiddleware = upload.single('avatar');

/**
 * Updates the user's profile with the uploaded avatar file.
 * 
 * @route   POST /user/avatar
 * @access  Private
 * @param   {Object} req - Express request object containing uploaded avatar file and authenticated user data.
 * @param   {Object} res - Express response object used to send the new avatar URL or return an error.
 * 
 * @throws  400 if no file is uploaded.
 * @throws  500 on server error.
 */
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
