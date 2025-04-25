const express = require('express');
const router = express.Router();
const { signup, login, completeOnboarding } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // ✅ fixes the import

const User = require('../models/User'); // ✅ ADD THIS if not already there

// Signup route
router.post('/signup', signup);

// Login route
router.post('/login', login);

// Onboarding route
router.patch('/onboarding', protect, completeOnboarding);

// ✅ Add this new route:
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
