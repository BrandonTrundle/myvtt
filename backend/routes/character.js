const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const Character = require('../models/Character');

// POST /api/characters
router.post('/', protect, async (req, res) => {
  try {
    const payload = {
      ...req.body,
      userId: req.user.id // ✅ inject userId explicitly
    };

    console.log('🧪 Final character payload:', payload);
    console.log('🧪 Type of attacks:', typeof payload.attacks, ' | Instanceof:', Array.isArray(payload.attacks));
    console.log('🧪 Sample attack:', payload.attacks[0]);
    console.log('🧪 attacks field schema:', Character.schema.path('attacks'));
    const character = await Character.create(payload);
    res.status(201).json(character);
  } catch (err) {
    console.error('❌ Failed to create character:', err);
    res.status(400).json({ message: err.message });
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
