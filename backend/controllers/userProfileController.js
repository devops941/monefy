const userProfileService = require('../services/userProfileService');

const getProfile = async (req, res) => {
  try {
    const profile = await userProfileService.getProfile(req.userId);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const profile = await userProfileService.updateProfile(req.userId, req.body);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

module.exports = { getProfile, updateProfile };
