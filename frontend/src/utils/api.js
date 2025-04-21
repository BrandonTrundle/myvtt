export const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options.headers || {}),
  };

  // Only add Content-Type if not FormData
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  return fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });
};
