// Content catalog: each type defines its own form fields, supported outputs and prompt guidance.
// Adding a new content type = adding one object here (no other server or client code changes).

const TONES = ['professional', 'friendly', 'formal', 'casual', 'inspiring', 'humorous', 'warm'];
const VISUAL_STYLES = ['modern', 'minimal', 'vibrant', 'elegant', 'playful', 'tech', 'traditional', 'cinematic'];
const LANGUAGES = ['English', 'Hindi', 'Hindi + English', 'Hinglish', 'Marathi', 'Gujarati', 'Bengali', 'Tamil', 'Telugu', 'Kannada', 'Punjabi', 'Urdu'];
const PLATFORMS = ['Instagram', 'WhatsApp', 'Facebook', 'LinkedIn', 'X (Twitter)', 'YouTube', 'Print'];

const f = (name, label, o = {}) => ({ name, label, type: 'text', required: false, max: 200, ...o });

const CATEGORIES = [
  { id: 'social', label: 'Social media', blurb: 'Captions, posts and quote cards' },
  { id: 'event', label: 'Events', blurb: 'Posters, announcements and flyers' },
  { id: 'invitation', label: 'Invitations', blurb: 'Birthdays, weddings and parties' },
  { id: 'professional', label: 'Professional', blurb: 'LinkedIn posts and portfolio updates' },
  { id: 'education', label: 'Education', blurb: 'Workshops and learning material' },
  { id: 'creator', label: 'Creator tools', blurb: 'Thumbnails and video descriptions' },
  { id: 'business', label: 'Business', blurb: 'Promotions, offers and launches' },
  { id: 'personal', label: 'Personal', blurb: 'Greetings and personal messages' },
];

const TEXT_POST = ['headline', 'caption', 'cta', 'hashtags'];

const CONTENT_TYPES = [
  {
    id: 'social_caption', category: 'social', label: 'Social media caption', description: 'A ready-to-post caption with hashtags.',
    supportedOutputs: ['text'], defaultOutputs: ['text'], textFields: ['caption', 'hashtags'], showPlatform: true, showVisualStyle: false, profileRelevant: true,
    fields: [f('topic', 'What is the post about?', { required: true, type: 'textarea', max: 400, placeholder: 'Our new weekend brunch menu' }), f('audience', 'Audience', { placeholder: 'Young professionals' }), f('keyPoints', 'Key points to include', { type: 'textarea', max: 400 })],
    guidance: 'Write one engaging caption suited to the platform. Hashtags: 5-10.',
  },
  {
    id: 'quote_card', category: 'social', label: 'Quote card', description: 'A quote or message turned into a shareable visual.',
    supportedOutputs: ['text', 'image'], defaultOutputs: ['text', 'image'], textFields: ['headline', 'caption', 'hashtags'], showPlatform: true, showVisualStyle: true, profileRelevant: false, aspect: 'square',
    fields: [f('theme', 'Theme or message', { required: true, type: 'textarea', max: 300, placeholder: 'Never stop learning' }), f('author', 'Attribute to (optional)', { placeholder: 'Your name or leave empty' })],
    guidance: 'headline is the quote itself (max 120 characters). Write an original quote unless the user supplied one; never attribute it to a real person unless the user did.',
  },
  {
    id: 'event_poster', category: 'event', label: 'Event poster', description: 'Poster visual plus announcement text.',
    supportedOutputs: ['text', 'image'], defaultOutputs: ['text', 'image'], textFields: TEXT_POST, showPlatform: true, showVisualStyle: true, profileRelevant: true, aspect: 'portrait',
    fields: [f('eventName', 'Event name', { required: true, placeholder: 'National Hackathon 2026' }), f('date', 'Date', { required: true, placeholder: '20 November 2026' }), f('venue', 'Venue', { required: true, placeholder: 'College Auditorium' }), f('audience', 'Audience', { placeholder: 'Students and developers' }), f('details', 'Other details', { type: 'textarea', max: 400 })],
    guidance: 'Use only the supplied date, venue and details. The CTA should encourage registration or attendance.',
  },
  {
    id: 'event_announcement', category: 'event', label: 'Event announcement', description: 'A clear written announcement for an event.',
    supportedOutputs: ['text'], defaultOutputs: ['text'], textFields: ['headline', 'body', 'cta'], showPlatform: true, showVisualStyle: false, profileRelevant: true,
    fields: [f('eventName', 'Event name', { required: true }), f('date', 'Date', { required: true }), f('venue', 'Venue', { required: true }), f('audience', 'Audience'), f('details', 'Other details', { type: 'textarea', max: 400 })],
    guidance: 'body is a complete announcement of 80-150 words.',
  },
  {
    id: 'birthday_invitation', category: 'invitation', label: 'Birthday invitation', description: 'Invitation wording and a visual card.',
    supportedOutputs: ['text', 'image'], defaultOutputs: ['text', 'image'], textFields: ['headline', 'body', 'cta'], showPlatform: false, showVisualStyle: true, profileRelevant: false, aspect: 'portrait',
    fields: [f('guestOfHonor', 'Name of the birthday person', { required: true }), f('date', 'Date', { required: true }), f('time', 'Time'), f('venue', 'Venue', { required: true }), f('host', 'Hosted by'), f('theme', 'Theme', { placeholder: 'Space adventure' })],
    guidance: 'body is short, warm invitation wording. Do not invent times or addresses.',
  },
  {
    id: 'wedding_invitation', category: 'invitation', label: 'Wedding invitation', description: 'Invitation wording and an elegant visual.',
    supportedOutputs: ['text', 'image'], defaultOutputs: ['text', 'image'], textFields: ['headline', 'body', 'cta'], showPlatform: false, showVisualStyle: true, profileRelevant: false, aspect: 'portrait',
    fields: [f('couple', 'Names of the couple', { required: true, placeholder: 'Asha & Rohan' }), f('date', 'Date', { required: true }), f('venue', 'Venue', { required: true }), f('hosts', 'Hosted by'), f('details', 'Other details', { type: 'textarea', max: 400 })],
    guidance: 'body is respectful, graceful invitation wording appropriate to the language and culture requested.',
  },
  {
    id: 'linkedin_post', category: 'professional', label: 'LinkedIn post', description: 'A structured professional post to review and edit.',
    supportedOutputs: ['text'], defaultOutputs: ['text'], textFields: ['headline', 'body', 'hashtags'], showPlatform: false, showVisualStyle: false, profileRelevant: false,
    fields: [f('topic', 'Topic or achievement', { required: true, type: 'textarea', max: 500, placeholder: 'Completed my summer internship at...' }), f('audience', 'Intended audience', { placeholder: 'Recruiters and peers' }), f('keyPoints', 'Key points', { type: 'textarea', max: 500 })],
    guidance: 'headline is a hook line. body is a 120-220 word LinkedIn post with short paragraphs. Do not invent achievements, employers or numbers.',
  },
  {
    id: 'portfolio_announcement', category: 'professional', label: 'Portfolio announcement', description: 'Announce a project, portfolio or milestone.',
    supportedOutputs: ['text'], defaultOutputs: ['text'], textFields: ['headline', 'body', 'cta', 'hashtags'], showPlatform: false, showVisualStyle: false, profileRelevant: false,
    fields: [f('project', 'Project or milestone', { required: true }), f('role', 'Your role'), f('link', 'Link (optional)'), f('details', 'Highlights', { type: 'textarea', max: 500 })],
    guidance: 'body is 80-160 words, confident but honest.',
  },
  {
    id: 'workshop_flyer', category: 'education', label: 'Workshop flyer', description: 'Flyer visual plus announcement text for a class or workshop.',
    supportedOutputs: ['text', 'image'], defaultOutputs: ['text', 'image'], textFields: TEXT_POST, showPlatform: true, showVisualStyle: true, profileRelevant: true, aspect: 'portrait',
    fields: [f('title', 'Workshop title', { required: true, placeholder: 'Study skills workshop' }), f('date', 'Date and time', { required: true }), f('venue', 'Venue or link', { required: true }), f('audience', 'Who is it for?'), f('topics', 'Topics covered', { type: 'textarea', max: 400 })],
    guidance: 'Educational, clear and encouraging. Use only the supplied schedule and topics.',
  },
  {
    id: 'thumbnail_concept', category: 'creator', label: 'YouTube thumbnail', description: 'A thumbnail visual with a short on-image title idea.',
    supportedOutputs: ['image', 'text'], defaultOutputs: ['image', 'text'], textFields: ['headline', 'description'], showPlatform: false, showVisualStyle: true, profileRelevant: false, aspect: 'landscape',
    fields: [f('videoTopic', 'Video topic', { required: true, placeholder: 'Python for beginners' }), f('audience', 'Audience'), f('mood', 'Mood or emotion', { placeholder: 'Curious, energetic' })],
    guidance: 'headline is a punchy on-thumbnail title of at most 5 words. description is a one-sentence description of the thumbnail concept.',
  },
  {
    id: 'video_description', category: 'creator', label: 'Video description', description: 'A YouTube-style description with hashtags.',
    supportedOutputs: ['text'], defaultOutputs: ['text'], textFields: ['headline', 'body', 'hashtags'], showPlatform: false, showVisualStyle: false, profileRelevant: false,
    fields: [f('videoTopic', 'Video topic', { required: true }), f('keyPoints', 'What the video covers', { type: 'textarea', max: 600 }), f('audience', 'Audience')],
    guidance: 'headline is a title idea. body is a 100-180 word description. Do not invent timestamps or links.',
  },
  {
    id: 'product_promotion', category: 'business', label: 'Product promotion', description: 'Promotional text and a product-style visual.',
    supportedOutputs: ['text', 'image'], defaultOutputs: ['text', 'image'], textFields: TEXT_POST, showPlatform: true, showVisualStyle: true, profileRelevant: true, aspect: 'square',
    fields: [f('product', 'Product or service', { required: true, placeholder: 'Cold brew coffee' }), f('offer', 'Offer or key message', { placeholder: 'Buy 1 Get 1' }), f('audience', 'Audience', { placeholder: 'College students' }), f('occasion', 'Occasion', { placeholder: 'Weekend' })],
    guidance: 'Never invent prices, discounts or claims beyond the supplied offer.',
  },
  {
    id: 'festival_promotion', category: 'business', label: 'Festival promotion', description: 'Festive offer post with text and visual.',
    supportedOutputs: ['text', 'image'], defaultOutputs: ['text', 'image'], textFields: TEXT_POST, showPlatform: true, showVisualStyle: true, profileRelevant: true, aspect: 'square',
    fields: [f('festival', 'Festival or occasion', { required: true, placeholder: 'Diwali' }), f('product', 'Product or collection', { required: true }), f('offer', 'Offer', { placeholder: '30% OFF' }), f('audience', 'Audience')],
    guidance: 'Culturally respectful festive tone. Never invent offers.',
  },
  {
    id: 'greeting', category: 'personal', label: 'Greeting message', description: 'A heartfelt message with an optional greeting card visual.',
    supportedOutputs: ['text', 'image'], defaultOutputs: ['text'], textFields: ['headline', 'body'], showPlatform: false, showVisualStyle: true, profileRelevant: false, aspect: 'square',
    fields: [f('occasion', 'Occasion', { required: true, placeholder: 'Congratulations on your new job' }), f('recipient', 'For whom?', { placeholder: 'My friend Riya' }), f('details', 'Anything personal to include', { type: 'textarea', max: 400 })],
    guidance: 'body is a sincere message of 40-90 words. Do not invent shared memories.',
  },
];

const byId = new Map(CONTENT_TYPES.map((t) => [t.id, t]));

// Public shape for the client: never includes prompt guidance.
const publicType = (t) => ({
  id: t.id, category: t.category, label: t.label, description: t.description, fields: t.fields,
  textFields: t.textFields, supportedOutputs: t.supportedOutputs, defaultOutputs: t.defaultOutputs, showPlatform: t.showPlatform, showVisualStyle: t.showVisualStyle, profileRelevant: t.profileRelevant,
});

module.exports = {
  TONES, VISUAL_STYLES, LANGUAGES, PLATFORMS, CATEGORIES, CONTENT_TYPES,
  getType: (id) => byId.get(id),
  catalog: () => ({ categories: CATEGORIES, types: CONTENT_TYPES.map(publicType), meta: { tones: TONES, visualStyles: VISUAL_STYLES, languages: LANGUAGES, platforms: PLATFORMS } }),
};
