export const formatDate = (d) => new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
export const cap = (s = '') => s.charAt(0).toUpperCase() + s.slice(1);
export const FIELD_LABELS = { headline: 'Headline', caption: 'Caption', description: 'Description', body: 'Main text', cta: 'Call to action', hashtags: 'Hashtags' };
