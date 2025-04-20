const express = require('express');
const router = express.Router();
const { signup, login, completeOnboarding } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.patch('/onboarding', protect, completeOnboarding);

module.exports = router;
