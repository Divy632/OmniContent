const mongoose = require('mongoose');

const creationSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    contentCategory: {
      type: String,
      required: [true, 'Content category is required']
    },
    contentType: {
      type: String,
      required: [true, 'Content type is required'],
      index: true
    },
    title: {
      type: String,
      required: [true, 'Creation title is required'],
      trim: true
    },
    inputDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    preferences: {
      language: { type: String, default: 'English' },
      tone: { type: String, default: 'Professional' },
      visualStyle: { type: String, default: 'Modern Minimalist' },
      platform: { type: String, default: 'General' },
      dimensions: { type: String, default: '1:1' }
    },
    generatedText: {
      headline: { type: String, default: '' },
      caption: { type: String, default: '' },
      description: { type: String, default: '' },
      cta: { type: String, default: '' },
      hashtags: [{ type: String }]
    },
    imageUrl: {
      type: String,
      default: ''
    },
    outputMetadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    status: {
      type: String,
      enum: ['draft', 'completed', 'failed'],
      default: 'completed'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Creation', creationSchema);
