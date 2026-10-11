// AI output is untrusted: strip markup and control characters before it is stored or displayed.
function cleanText(value, max = 2000) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .trim()
    .slice(0, max);
}

function escapeXml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
const isHex = (v) => typeof v === 'string' && HEX.test(v.trim());

module.exports = { cleanText, escapeXml, isHex };
