const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    profileType: {
      type: String,
      enum: ['individual', 'business', 'organization', 'creator', 'student', 'other'],
      default: 'individual'
    },
    name: {
      type: String,
      default: '',
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    logoUrl: {
      type: String,
      default: ''
    },
    brandColors: {
      type: [String],
      default: ['#4f46e5', '#06b6d4']
    },
    contact: {
      email: { type: String, default: '' },
      phone: { type: String, default: '' }
    },
    website: {
      type: String,
      default: ''
    },
    socialLinks: {
      instagram: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      youtube: { type: String, default: '' }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Profile', profileSchema);
