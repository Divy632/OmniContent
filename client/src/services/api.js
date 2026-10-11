const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.code = data.code;
    error.data = data;
    throw error;
  }

  return data;
}

// Auth API
export const authApi = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request('/auth/me'),
  updatePreferences: (preferences) =>
    request('/auth/preferences', { method: 'PUT', body: JSON.stringify({ preferences }) })
};

// Content Catalog API
export const catalogApi = {
  getCategories: () => request('/content-types/categories'),
  getContentTypes: (category) =>
    request(`/content-types${category ? `?category=${category}` : ''}`),
  getContentType: (id) => request(`/content-types/${id}`)
};

// Creations API
export const creationApi = {
  generate: (payload) =>
    request('/creations/generate', { method: 'POST', body: JSON.stringify(payload) }),
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/creations${query ? `?${query}` : ''}`);
  },
  getById: (id) => request(`/creations/${id}`),
  update: (id, updates) =>
    request(`/creations/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  regenerate: (id, payload) =>
    request(`/creations/${id}/regenerate`, { method: 'POST', body: JSON.stringify(payload) }),
  delete: (id) => request(`/creations/${id}`, { method: 'DELETE' })
};

// Profile API
export const profileApi = {
  getMe: () => request('/profiles/me'),
  updateMe: (data) => request('/profiles/me', { method: 'PUT', body: JSON.stringify(data) })
};
