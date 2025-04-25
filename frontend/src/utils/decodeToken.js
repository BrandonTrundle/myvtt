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
