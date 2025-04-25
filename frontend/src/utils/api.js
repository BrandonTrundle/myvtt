export const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';
export const STATIC_BASE = process.env.REACT_APP_STATIC_BASE || 'http://localhost:5000';


export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(options.headers || {}),
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  // ✅ Only include Content-Type if not FormData
  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  console.log("📡 API Request:", `${API_BASE}${endpoint}`);
  console.log("📩 Request Headers:", headers);

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    console.log("📥 Response status:", res.status);

    const data = await res.json(); // ✅ parse only as JSON

    console.log("✅ Parsed response:", data);

    if (!res.ok) {
      console.error(`❌ API Error: ${res.status} ${res.statusText}`);
      throw new Error(data.message || 'Request failed');
    }

    return data;
  } catch (err) {
    console.error("❌ Network or parsing error:", err);
    throw new Error(err.message || 'Network error');
  }
};
