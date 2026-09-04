import React, { createContext, useState, useContext, useEffect } from 'react';
import { clearDriverCache } from '../api/drivers';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('foodloop_token') || localStorage.getItem('token');
    const userData = localStorage.getItem('foodloop_user') || localStorage.getItem('user');
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('foodloop_token', token);
    localStorage.setItem('foodloop_user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    clearDriverCache();
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('foodloop_token');
    localStorage.removeItem('foodloop_user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    clearDriverCache();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
