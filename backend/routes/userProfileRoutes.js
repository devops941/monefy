const express = require('express');
const userProfileController = require('../controllers/userProfileController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/api/profile', auth, userProfileController.getProfile);
router.put('/api/profile', auth, userProfileController.updateProfile);

module.exports = router;
