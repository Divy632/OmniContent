const test = require('node:test');
const assert = require('node:assert');
const { CONTENT_TYPES, getType, catalog } = require('../config/contentTypes');
const { buildTextPrompt, buildImagePrompt } = require('../services/promptBuilder');
const { normalizeText } = require('../services/aiTextService');
const { registerSchema, generateSchema, validateInputDetails, resolveType } = require('../validators/schemas');
const { sniffImage } = require('../utils/fileType');

const poster = getType('event_poster');
const input = { eventName: 'National Hackathon 2026', date: '20 November 2026', venue: 'College Auditorium', audience: 'Students', details: '' };
const prefs = { language: 'English', tone: 'professional', platform: 'Instagram', visualStyle: 'modern', useProfile: true };

test('catalog: every type has fields, valid outputs and no leaked prompt guidance in the public shape', () => {
  assert.ok(CONTENT_TYPES.length >= 12);
  for (const t of CONTENT_TYPES) {
    assert.ok(t.fields.some((f) => f.required), `${t.id} has a required field`);
    assert.ok(t.defaultOutputs.every((o) => t.supportedOutputs.includes(o)));
  }
  assert.ok(catalog().types.every((t) => !('guidance' in t)));
});

test('unsupported content type is rejected', () => {
  assert.throws(() => resolveType('made_up'), (e) => e.code === 'UNSUPPORTED_CONTENT_TYPE');
});

test('dynamic validation: required fields enforced, unknown keys dropped', () => {
  assert.throws(() => validateInputDetails(poster, { eventName: 'x' }), (e) => e.code === 'VALIDATION_ERROR');
  const clean = validateInputDetails(poster, { ...input, injected: 'nope' });
  assert.strictEqual(clean.injected, undefined);
  assert.strictEqual(clean.venue, 'College Auditorium');
});

test('text prompt includes supplied facts, tone, language and only the requested JSON keys', () => {
  const { user, system } = buildTextPrompt({ type: poster, input, prefs, profile: { name: 'Tech Club', profileType: 'organization', brandColors: ['#112233'] } });
  for (const s of ['National Hackathon 2026', '20 November 2026', 'College Auditorium', 'professional', 'Tech Club', '"headline"', '"cta"']) assert.ok(user.includes(s), s);
  assert.ok(!user.includes('"body"'));
  assert.match(system, /Do not invent/);
});

test('profile context is omitted when no profile is supplied', () => {
  const { user } = buildTextPrompt({ type: poster, input, prefs, profile: null });
  assert.match(user, /OPTIONAL PROFILE CONTEXT\nnone/);
});

test('image prompt forbids rendered text and mentions the aspect ratio', () => {
  const p = buildImagePrompt({ type: poster, input, prefs, profile: null, copy: { headline: 'Build.' }, title: 'x' });
  assert.match(p, /do not render any text/);
  assert.match(p, /portrait/);
});

test('normalizeText keeps only requested fields, strips HTML and fixes hashtags', () => {
  const out = normalizeText('```json\n{"headline":"<b>Hi</b>","caption":"Hello","cta":"Go","hashtags":["Code","#Fun"],"extra":"x"}\n```', ['headline', 'caption', 'cta', 'hashtags']);
  assert.deepStrictEqual(out, { headline: 'Hi', caption: 'Hello', cta: 'Go', hashtags: ['#Code', '#Fun'] });
  assert.throws(() => normalizeText('{"headline":"only"}', ['headline', 'caption']), (e) => e.code === 'GENERATION_FAILED');
  assert.throws(() => normalizeText('not json', ['body']), (e) => e.code === 'GENERATION_FAILED');
});

test('request schemas', () => {
  assert.strictEqual(registerSchema.safeParse({ name: 'Asha', email: 'bad', password: 'longenough' }).success, false);
  assert.strictEqual(generateSchema.safeParse({ contentType: 'event_poster', inputDetails: input, outputs: [] }).success, false);
  assert.strictEqual(generateSchema.safeParse({ contentType: 'event_poster', inputDetails: input, preferences: { tone: 'shouting' } }).success, false);
  assert.strictEqual(generateSchema.safeParse({ contentType: 'event_poster', inputDetails: input, outputs: ['text', 'image'] }).success, true);
});

test('sniffImage trusts bytes, not extensions', () => {
  assert.strictEqual(sniffImage(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0, 0, 0, 0, 0, 0, 0, 0, 0])).mime, 'image/png');
  assert.strictEqual(sniffImage(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>')), null);
});
