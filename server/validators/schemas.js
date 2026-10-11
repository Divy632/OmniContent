const { z } = require('zod');
const { TONES, VISUAL_STYLES, PLATFORMS, getType } = require('../config/contentTypes');
const AppError = require('../utils/AppError');

const trimmed = (max, min = 0) => z.string().trim().min(min).max(max);
const optional = (max) => z.string().trim().max(max).optional().default('');

const registerSchema = z.object({
  name: trimmed(80, 2),
  email: z.string().trim().toLowerCase().email('Please enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.').max(100),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Please enter your password.'),
});

const preferencesSchema = z.object({
  language: trimmed(60, 2).optional(),
  tone: z.enum(TONES).optional(),
  visualStyle: z.enum(VISUAL_STYLES).optional(),
});

const profileSchema = z.object({
  profileType: z.enum(['personal', 'business', 'organization']).default('business'),
  name: trimmed(120, 2),
  description: optional(800),
  brandColors: z.string().optional().default(''),
  contactEmail: z.union([z.literal(''), z.string().trim().email('Contact email is not valid.')]).optional().default(''),
  contactPhone: optional(30),
  website: optional(200),
  instagram: optional(200),
  facebook: optional(200),
  linkedin: optional(200),
});

const generateSchema = z.object({
  contentType: z.string().trim().min(1, 'Choose a content type.'),
  title: z.string().trim().max(120).optional(),
  inputDetails: z.record(z.any()).default({}),
  preferences: z.object({
    language: trimmed(60, 2).optional(),
    tone: z.enum(TONES).optional(),
    platform: z.enum(PLATFORMS).optional(),
    visualStyle: z.enum(VISUAL_STYLES).optional(),
    useProfile: z.boolean().optional(),
  }).default({}),
  outputs: z.array(z.enum(['text', 'image'])).min(1, 'Choose text, image, or both.').optional(),
});

const regenerateSchema = z.object({ outputs: z.array(z.enum(['text', 'image'])).min(1).optional() }).default({});

const updateSchema = z.object({
  title: trimmed(120, 2).optional(),
  favorite: z.boolean().optional(),
  generatedText: z.object({
    headline: trimmed(120).optional(), caption: trimmed(2200).optional(), description: trimmed(600).optional(),
    body: trimmed(4000).optional(), cta: trimmed(80).optional(), hashtags: z.array(trimmed(40)).max(15).optional(),
  }).optional(),
});

// Validates the dynamic, content-type-specific fields. Unknown keys are dropped.
function validateInputDetails(type, raw) {
  const clean = {};
  for (const field of type.fields) {
    let v = raw?.[field.name];
    v = typeof v === 'string' ? v.trim() : '';
    if (!v && field.required) throw new AppError(`${field.label} is required.`, 400, 'VALIDATION_ERROR', [{ field: field.name }]);
    if (v.length > field.max) throw new AppError(`${field.label} must be ${field.max} characters or fewer.`, 400, 'VALIDATION_ERROR', [{ field: field.name }]);
    if (field.options && v && !field.options.includes(v)) throw new AppError(`${field.label} is not a valid choice.`, 400, 'VALIDATION_ERROR');
    clean[field.name] = v;
  }
  return clean;
}

function resolveType(id) {
  const type = getType(id);
  if (!type) throw new AppError('That content type is not supported.', 400, 'UNSUPPORTED_CONTENT_TYPE');
  return type;
}

module.exports = { registerSchema, loginSchema, preferencesSchema, profileSchema, generateSchema, regenerateSchema, updateSchema, validateInputDetails, resolveType };
