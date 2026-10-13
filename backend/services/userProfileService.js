const UserProfile = require('../models/UserProfile');

const getProfile = async (userId) => {
  let profile = await UserProfile.findOne({ userId });
  if (!profile) {
    profile = await UserProfile.create({ userId });
  }
  return profile;
};

const updateProfile = async (userId, data) => {
  return await UserProfile.findOneAndUpdate({ userId }, data, { new: true, upsert: true });
};

module.exports = { getProfile, updateProfile };
