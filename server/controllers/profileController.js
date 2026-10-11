const { profileStore } = require('../services/dataStore');

const getMyProfile = async (req, res, next) => {
  try {
    const profile = await profileStore.findByOwner(req.user._id);
    res.status(200).json({
      success: true,
      profile: profile || null
    });
  } catch (error) {
    next(error);
  }
};

const updateMyProfile = async (req, res, next) => {
  try {
    const {
      profileType,
      name,
      description,
      logoUrl,
      brandColors,
      contact,
      website,
      socialLinks
    } = req.body;

    const profile = await profileStore.upsert(req.user._id, {
      profileType,
      name,
      description,
      logoUrl,
      brandColors,
      contact,
      website,
      socialLinks
    });

    res.status(200).json({
      success: true,
      message: 'Profile saved successfully.',
      profile
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile
};
