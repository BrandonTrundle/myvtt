/**
 * Author: Brandon Trundle
 * File Name: authMiddleware.js
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Middleware to authenticate users in ArcanaTable.
 * Verifies JWT tokens from the Authorization header,
 * attaches the user object to the request for further use,
 * and handles unauthorized access scenarios.
 */

const jwt = require('jsonwebtoken'); // Library for signing and verifying JWT tokens
const User = require('../models/User'); // Mongoose model for user data

/**
 * Middleware function to protect private routes by verifying JWT tokens.
 * 
 * @access  Private
 * @param   {Object} req - Express request object containing the Authorization header.
 * @param   {Object} res - Express response object used to send authorization errors.
 * @param   {Function} next - Express next middleware function to continue request flow.
 * 
 * @throws  401 if no token is provided, token is invalid, or user is not found.
 */
const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith('Bearer ')) {
    // console.log("📨 Token found in request headers, verifying...");
    try {
      token = token.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //console.log("✅ Token successfully verified, decoded ID:", decoded.id);

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        console.log("❌ User not found for token ID:", decoded.id);
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // console.log("✅ User authenticated successfully:", req.user._id);
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
