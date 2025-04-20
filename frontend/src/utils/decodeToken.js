export function decodeToken(token) {
    if (!token) return null;
  
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (err) {
      console.error('Invalid token', err);
      return null;
    }
  }
  