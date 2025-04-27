/**
 * Author: Brandon Trundle
 * File Name: authController.js
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Handles user authentication and onboarding logic for ArcanaTable.
 * Provides API endpoints for:
 *  - Signing up new users
 *  - Logging in existing users
 *  - Retrieving authenticated user profiles
 *  - Completing onboarding information
 */


const express = require('express');
const router = express.Router(); // Creates a new router object for handling routes
const jwt = require('jsonwebtoken'); // Used to sign and verify JWT tokens for authentication
const bcrypt = require('bcrypt'); // Used to hash and compare passwords securely
const User = require('../models/User'); // Mongoose model for interacting with User collection
const { protect } = require('../middleware/authMiddleware'); // Middleware to protect private routes via JWT validation

/**
 * @route   POST /signup
 * @desc    Registers a new user with email, password, firstName, and lastName.
 *          Hashes password via Mongoose pre-save hook before saving to database.
 * @access  Public
 * @param   {Object} req - Express request object containing user signup details.
 * @param   {Object} res - Express response object used to send success or error response.
 */
router.post('/signup', async (req, res) => {
  console.log("📨 POST /signup called");

  try {
    const { email, password, firstName, lastName } = req.body;
    console.log("Received signup data:", { email, firstName, lastName });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ Signup failed: Email already in use");
      return res.status(400).json({ message: 'Email already in use' });
    }

    const newUser = new User({
      email,
      password, // Let Mongoose pre-save hook hash this
      firstName,
      lastName,
    });

    await newUser.save();
    console.log("✅ New user created with ID:", newUser._id);

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    console.log("🔐 JWT generated for new user");
    res.status(201).json({ token });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ message: 'Failed to register user' });
  }
});

/**
 * @route   POST /login
 * @desc    Authenticates an existing user using email and password.
 *          Returns a JWT token and user profile if credentials are valid.
 * @access  Public
 * @param   {Object} req - Express request object containing login credentials.
 * @param   {Object} res - Express response object used to send user data or error message.
 */
router.post('/login', async (req, res) => {
  console.log("📨 POST /login called");

  try {
    const { email, password } = req.body;
    console.log("Login attempt for email:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ Login failed: User not found");
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Login failed: Incorrect password");
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    console.log("✅ Login successful, JWT generated for:", user._id);

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatarUrl: user.avatarUrl,
        subscriptionTier: user.subscriptionTier,
        hoursPlayed: user.hoursPlayed,
        language: user.language,
        playPreferences: user.playPreferences,
        onboardingComplete: user.onboardingComplete,
        displayName: user.displayName,
        role: user.role,
        experienceLevel: user.experienceLevel,
        groupType: user.groupType,
      }
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: 'Login failed' });
  }
});

/**
 * @route   GET /me
 * @desc    Retrieves the profile of the currently authenticated user.
 * @access  Private (requires valid JWT)
 * @param   {Object} req - Express request object containing user ID from token.
 * @param   {Object} res - Express response object used to send user profile data.
 */
router.get('/me', protect, async (req, res) => {
  console.log("📨 GET /me called");

  try {
    console.log("Authenticated user ID from token:", req.user._id);
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      console.log("❌ /me failed: User not found");
      return res.status(404).json({ message: 'User not found' });
    }

    console.log("✅ /me success: User data returned");
    res.json(user);
  } catch (err) {
    console.error("❌ /me error:", err);
    res.status(500).json({ message: 'Failed to get user info' });
  }
});

/**
 * @route   PATCH /onboarding
 * @desc    Updates onboarding fields for the currently authenticated user.
 *          Marks onboardingComplete as true after successful update.
 * @access  Private (requires valid JWT)
 * @param   {Object} req - Express request object containing onboarding fields.
 * @param   {Object} res - Express response object used to send updated user data.
 */
router.patch('/onboarding', protect, async (req, res) => { // ✅ FIXED
  console.log("📨 PATCH /onboarding called");

  try {
    console.log("Updating onboarding fields for user:", req.user._id);
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { ...req.body, onboardingComplete: true },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      console.log("❌ Onboarding update failed: User not found");
      return res.status(404).json({ message: 'User not found' });
    }

    console.log("✅ Onboarding updated for user:", updatedUser._id);
    res.json(updatedUser);
  } catch (err) {
    console.error("❌ Onboarding update error:", err);
    res.status(500).json({ message: 'Failed to complete onboarding' });
  }
});

module.exports = router;
