const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const env = require('../config/env');
const AppError = require('../utils/AppError');
const { fetchWithRetry } = require('./http');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
const sha1 = (s) => crypto.createHash('sha1').update(s).digest('hex');

const storageFail = (detail) => {
  console.error('[storage]', detail);
  return new AppError('We could not save the image. Please try again.', 502, 'STORAGE_FAILED');
};

async function saveLocal(buffer, ext) {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const key = `${crypto.randomUUID()}.${ext}`; // generated name: user input never reaches the filesystem
  await fs.writeFile(path.join(UPLOAD_DIR, key), buffer);
  return { url: `${env.publicUrl}/uploads/${key}`, key, storage: 'local' };
}

async function saveCloudinary(buffer, mime, folder) {
  const { cloudName, apiKey, apiSecret } = env.cloudinary;
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = sha1(`folder=${folder}&timestamp=${timestamp}${apiSecret}`);
  const form = new FormData();
  form.append('file', new Blob([buffer], { type: mime }), 'upload');
  form.append('api_key', apiKey);
  form.append('timestamp', String(timestamp));
  form.append('folder', folder);
  form.append('signature', signature);
  const res = await fetchWithRetry(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: form });
  if (!res.ok) throw storageFail(`cloudinary ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  return { url: data.secure_url, key: data.public_id, storage: 'cloudinary' };
}

// Returns { url, key, storage }. MongoDB only ever stores these three values, never binary data.
async function save(buffer, { mime, ext }, { folder = 'content-platform' } = {}) {
  try {
    return env.cloudinary.enabled ? await saveCloudinary(buffer, mime, folder) : await saveLocal(buffer, ext);
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw storageFail(err.message);
  }
}

async function remove({ key, storage }) {
  if (!key) return;
  try {
    if (storage === 'local') {
      await fs.unlink(path.join(UPLOAD_DIR, path.basename(key)));
    } else if (storage === 'cloudinary' && env.cloudinary.enabled) {
      const { cloudName, apiKey, apiSecret } = env.cloudinary;
      const timestamp = Math.floor(Date.now() / 1000);
      const signature = sha1(`public_id=${key}&timestamp=${timestamp}${apiSecret}`);
      const form = new URLSearchParams({ public_id: key, api_key: apiKey, timestamp: String(timestamp), signature });
      await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, { method: 'POST', body: form });
    }
  } catch (err) {
    console.warn('[storage] cleanup failed:', err.message); // cleanup is best-effort
  }
}

// Used by the authenticated download endpoint.
async function read({ key, storage, url }) {
  if (storage === 'local') return fs.readFile(path.join(UPLOAD_DIR, path.basename(key)));
  const res = await fetchWithRetry(url, {}, { timeoutMs: 60000 });
  if (!res.ok) throw storageFail(`download ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

module.exports = { save, remove, read, UPLOAD_DIR };
