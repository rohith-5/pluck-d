const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const { getProfile, updateProfile, changePassword } = require('../controllers/userController');

// Get user profile
router.get('/profile', authenticateUser, getProfile);

// Update user profile
router.put('/profile', authenticateUser, updateProfile);

// Change password
router.put('/password', authenticateUser, changePassword);

module.exports = router;
