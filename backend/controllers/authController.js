const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// Register a new user
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

// Login a user
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

// Get current authenticated user
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

// Update onboarding fields
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
