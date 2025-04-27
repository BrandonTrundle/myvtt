/**
 * Author: Brandon Trundle
 * File Name: decodeToken.js
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Utility function for decoding a JSON Web Token (JWT) payload.
 * 
 * Behavior:
 * - Safely decodes a base64-encoded JWT payload.
 * - Returns the decoded payload as a JavaScript object.
 * - Gracefully handles missing or malformed tokens.
 * 
 * Exports:
 * - decodeToken: Function to decode a JWT and extract its payload.
 */

/**
 * Decodes the payload of a JWT (JSON Web Token).
 * 
 * @param {string} token - The JWT to decode
 * @returns {Object|null} - The decoded payload object, or null if decoding fails
 * 
 * Behavior:
 * - Splits the token by periods.
 * - Base64-decodes the payload section.
 * - Parses the decoded string as JSON.
 * - Logs and handles any decoding errors.
 */
export function decodeToken(token) {
  if (!token) {
    console.warn("⚠️ No token provided");
    return null;
  }

  try {
    console.log("📡 Decoding token:", token);

    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));

    console.log("✅ Decoded token payload:", decoded);
    return decoded;
  } catch (err) {
    console.error('❌ Invalid token or decoding error:', err);
    return null;
  }
}
