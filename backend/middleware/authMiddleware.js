const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith('Bearer ')) {
    console.log("📨 Token found in request headers, verifying...");
    try {
      token = token.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Token successfully verified, decoded ID:", decoded.id);

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        console.log("❌ User not found for token ID:", decoded.id);
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      console.log("✅ User authenticated successfully:", req.user._id);
      next();
    } catch (err) {
      console.error('❌ Token verification failed:', err);
      res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  } else {
    console.log("❌ No token provided in request headers");
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = {
  protect,
};
