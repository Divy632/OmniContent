const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const User = require('../models/User');
const Creation = require('../models/Creation');
const Profile = require('../models/Profile');
const { getIsConnected } = require('../config/db');

const DB_FILE = path.join(__dirname, '../data/db.json');

// Initialize local DB file if not present
function getLocalData() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = { users: [], creations: [], profiles: [] };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local db file:', err.message);
    return { users: [], creations: [], profiles: [] };
  }
}

function saveLocalData(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local db file:', err.message);
  }
}

function generateId() {
  return new mongoose.Types.ObjectId().toString();
}

// User operations
const userStore = {
  async findByEmail(email) {
    if (getIsConnected()) {
      return await User.findOne({ email: email.toLowerCase() });
    }
    const db = getLocalData();
    return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findById(id) {
    if (getIsConnected()) {
      return await User.findById(id).select('-passwordHash');
    }
    const db = getLocalData();
    const user = db.users.find((u) => u._id === id.toString());
    if (!user) return null;
    const { passwordHash, ...rest } = user;
    return rest;
  },

  async findByIdWithPassword(id) {
    if (getIsConnected()) {
      return await User.findById(id);
    }
    const db = getLocalData();
    return db.users.find((u) => u._id === id.toString()) || null;
  },

  async create(userData) {
    if (getIsConnected()) {
      return await User.create(userData);
    }
    const db = getLocalData();
    const newUser = {
      _id: generateId(),
      name: userData.name,
      email: userData.email.toLowerCase(),
      passwordHash: userData.passwordHash,
      preferences: userData.preferences || {
        language: 'English',
        tone: 'Professional',
        visualStyle: 'Modern Minimalist'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.users.push(newUser);
    saveLocalData(db);
    return newUser;
  },

  async updatePreferences(id, preferences) {
    if (getIsConnected()) {
      return await User.findByIdAndUpdate(
        id,
        { $set: { preferences } },
        { new: true, runValidators: true }
      ).select('-passwordHash');
    }
    const db = getLocalData();
    const idx = db.users.findIndex((u) => u._id === id.toString());
    if (idx === -1) return null;
    db.users[idx].preferences = { ...db.users[idx].preferences, ...preferences };
    db.users[idx].updatedAt = new Date().toISOString();
    saveLocalData(db);
    const { passwordHash, ...rest } = db.users[idx];
    return rest;
  }
};

// Creation operations
const creationStore = {
  async create(data) {
    if (getIsConnected()) {
      return await Creation.create(data);
    }
    const db = getLocalData();
    const newCreation = {
      _id: generateId(),
      ownerId: data.ownerId.toString(),
      contentCategory: data.contentCategory,
      contentType: data.contentType,
      title: data.title,
      inputDetails: data.inputDetails || {},
      preferences: data.preferences || {},
      generatedText: data.generatedText || {
        headline: '',
        caption: '',
        description: '',
        cta: '',
        hashtags: []
      },
      imageUrl: data.imageUrl || '',
      outputMetadata: data.outputMetadata || {},
      status: data.status || 'completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.creations.unshift(newCreation);
    saveLocalData(db);
    return newCreation;
  },

  async findByOwner(ownerId, options = {}) {
    if (getIsConnected()) {
      const query = { ownerId };
      if (options.category) query.contentCategory = options.category;
      if (options.contentType) query.contentType = options.contentType;
      return await Creation.find(query).sort({ createdAt: -1 });
    }
    const db = getLocalData();
    let list = db.creations.filter((c) => c.ownerId === ownerId.toString());
    if (options.category) {
      list = list.filter((c) => c.contentCategory === options.category);
    }
    if (options.contentType) {
      list = list.filter((c) => c.contentType === options.contentType);
    }
    if (options.search) {
      const s = options.search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title?.toLowerCase().includes(s) ||
          c.generatedText?.headline?.toLowerCase().includes(s) ||
          c.contentType?.toLowerCase().includes(s)
      );
    }
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async findById(id) {
    if (getIsConnected()) {
      return await Creation.findById(id);
    }
    const db = getLocalData();
    return db.creations.find((c) => c._id === id.toString()) || null;
  },

  async update(id, updates) {
    if (getIsConnected()) {
      return await Creation.findByIdAndUpdate(
        id,
        { $set: { ...updates, updatedAt: new Date() } },
        { new: true }
      );
    }
    const db = getLocalData();
    const idx = db.creations.findIndex((c) => c._id === id.toString());
    if (idx === -1) return null;
    db.creations[idx] = {
      ...db.creations[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveLocalData(db);
    return db.creations[idx];
  },

  async delete(id) {
    if (getIsConnected()) {
      return await Creation.findByIdAndDelete(id);
    }
    const db = getLocalData();
    const idx = db.creations.findIndex((c) => c._id === id.toString());
    if (idx === -1) return null;
    const removed = db.creations.splice(idx, 1)[0];
    saveLocalData(db);
    return removed;
  }
};

// Profile operations
const profileStore = {
  async findByOwner(ownerId) {
    if (getIsConnected()) {
      return await Profile.findOne({ ownerId });
    }
    const db = getLocalData();
    return db.profiles.find((p) => p.ownerId === ownerId.toString()) || null;
  },

  async upsert(ownerId, data) {
    if (getIsConnected()) {
      return await Profile.findOneAndUpdate(
        { ownerId },
        { $set: { ...data, ownerId, updatedAt: new Date() } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
    }
    const db = getLocalData();
    let profile = db.profiles.find((p) => p.ownerId === ownerId.toString());
    if (profile) {
      Object.assign(profile, data, { updatedAt: new Date().toISOString() });
    } else {
      profile = {
        _id: generateId(),
        ownerId: ownerId.toString(),
        profileType: data.profileType || 'individual',
        name: data.name || '',
        description: data.description || '',
        logoUrl: data.logoUrl || '',
        brandColors: data.brandColors || ['#4f46e5', '#06b6d4'],
        contact: data.contact || { email: '', phone: '' },
        website: data.website || '',
        socialLinks: data.socialLinks || { instagram: '', linkedin: '', twitter: '', youtube: '' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      db.profiles.push(profile);
    }
    saveLocalData(db);
    return profile;
  }
};

module.exports = {
  userStore,
  creationStore,
  profileStore
};
