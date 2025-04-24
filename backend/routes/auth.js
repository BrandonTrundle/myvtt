const express = require('express');
const router = express.Router();
const { signup, login, completeOnboarding } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // ✅ fixes the import

const User = require('../models/User'); // ✅ ADD THIS if not already there

router.post('/signup', signup);
router.post('/login', login);
router.patch('/onboarding', protect, completeOnboarding);

// ✅ Add this new route:
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get user info', error: err.message });
  }
});

module.exports = router;
