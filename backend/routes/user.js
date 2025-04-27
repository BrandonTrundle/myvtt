/**
 * Author: Brandon Trundle
 * File Name: user.js
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Defines user-related routes for ArcanaTable users.
 * Currently supports uploading and updating a user's avatar image.
 * All routes are protected with JWT authentication middleware.
 */

const express = require('express'); // Express.js web framework
const router = express.Router(); // Express router instance for defining modular routes
const { uploadAvatar, avatarUploadMiddleware } = require('../controllers/userController'); // Controller and middleware for avatar uploads
const { protect } = require('../middleware/authMiddleware'); // Middleware to protect routes with JWT authentication

console.log("uploadAvatar:", uploadAvatar);
console.log("avatarUploadMiddleware:", avatarUploadMiddleware);

/**
 * @route   POST /api/user/avatar
 * @desc    Uploads and updates the authenticated user's avatar image.
 * @access  Private (requires JWT authentication)
 * Middleware: avatarUploadMiddleware
 */
router.post('/avatar', protect, avatarUploadMiddleware, uploadAvatar);

module.exports = router;
