const AppError = require('../utils/AppError');

// fetch with timeout and one retry for transient failures (network, 429, 5xx).
async function fetchWithRetry(url, options = {}, { timeoutMs = 60000, retries = 1 } = {}) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timer);
      if ((res.status === 429 || res.status >= 500) && attempt < retries) {
        await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
        continue;
      }
      return res;
    } catch (err) {
      clearTimeout(timer);
      lastError = err;
      if (attempt < retries) await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
    }
  }
  throw new AppError('Unable to generate content right now.', 502, 'GENERATION_FAILED', lastError?.message);
}

module.exports = { fetchWithRetry };
