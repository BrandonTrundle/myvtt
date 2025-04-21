import React, { createContext, useState, useEffect } from 'react';
import { apiFetch } from '../utils/api'; // adjust path if needed


export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
  
    try {
      const res = await apiFetch('/api/auth/me');
      const data = await res.json();
      if (res.ok) setUser(data);
    } catch (err) {
      console.error('❌ Failed to fetch user info:', err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};
