const Profile = require('../models/Profile');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const storage = require('./storageService');
const { sniffImage } = require('../utils/fileType');
const { isHex } = require('../utils/sanitize');

const toDoc = (b) => ({
  profileType: b.profileType,
  name: b.name,
  description: b.description || '',
  brandColors: String(b.brandColors || '').split(',').map((c) => c.trim()).filter(isHex).slice(0, 4),
  contact: { email: b.contactEmail || '', phone: b.contactPhone || '' },
  website: b.website || '',
  socialLinks: { instagram: b.instagram || '', facebook: b.facebook || '', linkedin: b.linkedin || '' },
});

async function saveLogo(file) {
  const kind = sniffImage(file.buffer);
  if (!kind) throw new AppError('Logo must be a valid PNG, JPG or WebP image.', 400, 'UPLOAD_ERROR');
  return storage.save(file.buffer, kind, { folder: 'content-platform/logos' });
}

const getMine = (userId) => Profile.findOne({ ownerId: userId });

// Create-or-update (PUT /profiles/me). The profile is optional everywhere else in the app.
async function upsert(userId, body, file) {
  let profile = await getMine(userId);
  if (!profile) profile = new Profile({ ownerId: userId });
  Object.assign(profile, toDoc(body));
  let old = null;
  if (file) {
    const saved = await saveLogo(file);
    old = { key: profile.logoKey, storage: profile.logoStorage };
    Object.assign(profile, { logoUrl: saved.url, logoKey: saved.key, logoStorage: saved.storage });
  }
  await profile.save();
  if (old) await storage.remove(old);
  return profile;
}

async function remove(userId) {
  const profile = await getMine(userId);
  if (!profile) return;
  await profile.deleteOne();
  await storage.remove({ key: profile.logoKey, storage: profile.logoStorage });
}

async function updatePreferences(user, prefs) {
  user.preferences = { ...(user.toObject().preferences || {}), ...prefs };
  await user.save();
  return user.toSafeJSON();
}

module.exports = { getMine, upsert, remove, updatePreferences };
