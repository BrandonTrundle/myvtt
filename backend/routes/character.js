/**
 * Author: Brandon Trundle
 * File Name: character.js
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Defines character management routes for ArcanaTable users.
 * Routes include creating, retrieving, updating, and deleting character sheets.
 * All routes are protected with JWT authentication middleware.
 */

const express = require('express'); // Express.js web framework
const { protect } = require('../middleware/authMiddleware'); // Middleware to protect routes with JWT authentication
const Character = require('../models/Character'); // Mongoose model for character sheet data
const router = express.Router();

/**
 * @route   POST /api/characters
 * @desc    Creates a new character sheet for the authenticated user.
 * @access  Private (requires JWT authentication)
 */
router.post('/', protect, async (req, res) => {
  console.log('🧪 Received payload:', req.body);

  try {
    const character = await Character.create({
      ...req.body,
      creator: req.user._id,
    });

    console.log("✅ Character created:", character._id);
    res.status(201).json(character);
  } catch (err) {
    console.error('❌ Error saving character:', err);
    res.status(500).json({ message: 'Failed to save character.' });
  }
});

/**
 * @route   GET /api/characters
 * @desc    Retrieves all character sheets created by the authenticated user.
 * @access  Private (requires JWT authentication)
 */
router.get('/', protect, async (req, res) => {
  console.log('📨 GET /api/characters called for user ID:', req.user._id);

  try {
    const characters = await Character.find({ creator: req.user.id });
    console.log("✅ Fetched characters for user:", characters.length);
    res.json(characters);
  } catch (err) {
    console.error('❌ Failed to fetch characters:', err);
    res.status(500).json({ message: 'Server error fetching characters.' });
  }
});

/**
 * @route   DELETE /api/characters/:id
 * @desc    Deletes a specific character sheet owned by the authenticated user.
 * @access  Private (requires JWT authentication)
 */
router.delete('/:id', protect, async (req, res) => {
  console.log("📨 DELETE /api/characters/:id called for character ID:", req.params.id);

  try {
    const character = await Character.findOneAndDelete({
      _id: req.params.id,
      creator: req.user._id,
    });

    if (!character) {
      console.log("❌ Character not found:", req.params.id);
      return res.status(404).json({ message: 'Character not found.' });
    }

    console.log("✅ Character deleted:", req.params.id);
    res.json({ message: 'Character deleted.' });
  } catch (err) {
    console.error('❌ Failed to delete character:', err);
    res.status(500).json({ message: 'Server error during deletion.' });
  }
});

/**
 * @route   GET /api/characters/:id
 * @desc    Retrieves a specific character sheet by ID for the authenticated user.
 * @access  Private (requires JWT authentication)
 */
router.get('/:id', protect, async (req, res) => {
  console.log("📨 GET /api/characters/:id called for character ID:", req.params.id);

  try {
    const character = await Character.findOne({
      _id: req.params.id,
      creator: req.user.id,
    });

    if (!character) {
      console.log("❌ Character not found:", req.params.id);
      return res.status(404).json({ message: 'Character not found.' });
    }

    console.log("✅ Character found:", character._id);
    res.json(character);
  } catch (err) {
    console.error('❌ Error fetching character by ID:', err);
    res.status(500).json({ message: 'Server error fetching character.' });
  }
});

/**
 * @route   PUT /api/characters/:id
 * @desc    Updates an existing character sheet for the authenticated user.
 * @access  Private (requires JWT authentication)
 */
router.put('/:id', protect, async (req, res) => {
  console.log("📨 PUT /api/characters/:id called to update character ID:", req.params.id);

  try {
    const updated = await Character.findOneAndUpdate(
      { _id: req.params.id, creator: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      console.log("❌ Character not found for update:", req.params.id);
      return res.status(404).json({ message: 'Character not found.' });
    }

    console.log("✅ Character updated:", updated._id);
    res.json(updated);
  } catch (err) {
    console.error('❌ Error updating character:', err);
    res.status(500).json({ message: 'Failed to update character.' });
  }
});

module.exports = router;
