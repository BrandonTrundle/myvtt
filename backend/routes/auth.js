/**
 * Author: Brandon Trundle
 * File Name: auth.js
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Defines authentication and onboarding routes for ArcanaTable users.
 * Routes include signup, login, onboarding completion, and retrieving the current authenticated user's profile.
 * Protects certain routes using JWT-based middleware authentication.
 */

const express = require('express'); // Express.js web framework
const router = express.Router(); // Express router instance for defining modular routes
const { signup, login, completeOnboarding } = require('../controllers/authController'); // Authentication controller functions
const { protect } = require('../middleware/authMiddleware'); // Middleware to protect routes by validating JWT tokens
const User = require('../models/User'); // Mongoose model for user data


/**
 * @route   POST /signup
 * @desc    Registers a new user with email, password, first name, and last name.
 * @access  Public
 */
router.post('/signup', signup);

/**
 * @route   POST /login
 * @desc    Logs in an existing user and returns a JWT token along with user profile.
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   PATCH /onboarding
 * @desc    Completes user onboarding setup fields after signup.
 * @access  Private (requires JWT authentication)
 */
router.patch('/onboarding', protect, completeOnboarding);

/**
 * @route   GET /me
 * @desc    Retrieves the authenticated user's profile data, excluding password.
 * @access  Private (requires JWT authentication)
 */
router.get('/me', protect, async (req, res) => {
  console.log("📨 GET /me hit for user ID:", req.user._id);

  try {
    const user = await User.findById(req.user._id).select('-password');
    console.log("✅ User data fetched for ID:", req.user._id);
    res.status(200).json(user);
  } catch (err) {
    console.error('❌ Error fetching user info:', err);
    res.status(500).json({ message: 'Failed to get user info', error: err.message });
  }
});

module.exports = router;
