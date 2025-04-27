/**
 * Author: Brandon Trundle
 * File Name: api.js
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Provides utility functions and constants for making authenticated API requests throughout ArcanaTable.
 * 
 * Behavior:
 * - Defines environment-based API and static base URLs.
 * - Provides a centralized fetch wrapper that handles authentication tokens and content-type headers automatically.
 * 
 * Exports:
 * - API_BASE: Base URL for all API requests.
 * - STATIC_BASE: Base URL for accessing static assets.
 * - apiFetch: Async function to perform API requests with token authorization and error handling.
 */

export const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api'; // Base URL for API requests
export const STATIC_BASE = process.env.REACT_APP_STATIC_BASE || 'http://localhost:5000'; // Base URL for static file serving


/**
 * apiFetch
 * 
 * A wrapper function around fetch() to handle API requests consistently across the app.
 * 
 * Behavior:
 * - Automatically attaches Authorization header if a token exists in localStorage.
 * - Sets 'Content-Type: application/json' unless sending FormData.
 * - Parses the response as JSON and handles errors gracefully.
 * 
 * @param {string} endpoint - API endpoint path (e.g., '/campaigns')
 * @param {object} [options={}] - Optional fetch configuration options (method, headers, body, etc.)
 * @returns {Promise<object>} - The parsed JSON response body
 * @throws {Error} - If network error occurs or server responds with non-2xx status
 */
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
