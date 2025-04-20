const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Create JWT
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// POST /api/auth/signup
exports.signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already in use' });

    const user = await User.create({ firstName, lastName, email, password });

    res.status(201).json({
      message: 'User created successfully',
      token: generateToken(user),
      user: {
        id: user._id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    res.status(200).json({
      message: 'Login successful',
      token: generateToken(user),
      user: {
        id: user._id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

exports.completeOnboarding = async (req, res) => {
    const userId = req.user._id;
    const {
      displayName,
      language,
      experienceLevel,
      role,
      groupType,
      playPreferences,
    } = req.body;
  
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        {
          displayName,
          language,
          experienceLevel,
          role,
          groupType,
          playPreferences,
        },
        { new: true }
      );
  
      res.status(200).json({
        message: 'Onboarding completed',
        user: {
          id: user._id,
          email: user.email,
          displayName: user.displayName,
        },
      });
    } catch (err) {
      res.status(500).json({ message: 'Failed to complete onboarding', error: err.message });
    }
  };
  