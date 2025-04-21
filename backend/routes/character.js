const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const Character = require('../models/Character');

// POST /api/characters
router.post('/', protect, async (req, res) => {
  try {
    const newChar = await Character.create({ ...req.body, userId: req.user._id });
    res.status(201).json(newChar);
  } catch (err) {
    console.error('❌ Failed to create character:', err);
    res.status(500).json({ message: 'Could not save character' });
  }
});

router.get('/', protect, async (req, res) => {
    try {
      const characters = await Character.find({ userId: req.user._id });
      res.json(characters);
    } catch (err) {
      console.error('❌ Failed to fetch characters:', err);
      res.status(500).json({ message: 'Could not fetch characters' });
    }
  });
  
  // ✅ DELETE /api/characters/:id - Delete a specific character
  router.delete('/:id', protect, async (req, res) => {
    try {
      const character = await Character.findOneAndDelete({
        _id: req.params.id,
        userId: req.user._id, // ensures user only deletes their own
      });
  
      if (!character) {
        return res.status(404).json({ message: 'Character not found or not authorized' });
      }
  
      res.json({ message: 'Character deleted' });
    } catch (err) {
      console.error('❌ Failed to delete character:', err);
      res.status(500).json({ message: 'Could not delete character' });
    }
  });

module.exports = router;
