// routes/character.js
const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const Character = require('../models/Character'); // Adjust if needed

const router = express.Router();

// POST /api/characters — All fields optional
router.post('/', protect, async (req, res) => {
  try {
    console.log('🧪 Received payload:', req.body);

    const character = await Character.create({
      ...req.body,
      creator: req.user._id,
    });

    res.status(201).json(character);
  } catch (err) {
    console.error('❌ Error saving character:', err);
    res.status(500).json({ message: 'Failed to save character.' });
  }
});

// Get all characters for the logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const characters = await Character.find({ creator: req.user.id });
    res.json(characters);
  } catch (err) {
    console.error('❌ Failed to fetch characters:', err);
    res.status(500).json({ message: 'Server error fetching characters.' });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const character = await Character.findOneAndDelete({
      _id: req.params.id,
      creator: req.user._id,
    });

    if (!character) {
      return res.status(404).json({ message: 'Character not found.' });
    }

    res.json({ message: 'Character deleted.' });
  } catch (err) {
    console.error('❌ Failed to delete character:', err);
    res.status(500).json({ message: 'Server error during deletion.' });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const character = await Character.findOne({
      _id: req.params.id,
      creator: req.user.id,
    });

    if (!character) return res.status(404).json({ message: 'Character not found.' });

    res.json(character);
  } catch (err) {
    console.error('❌ Error fetching character by ID:', err);
    res.status(500).json({ message: 'Server error fetching character.' });
  }
});

module.exports = router;
