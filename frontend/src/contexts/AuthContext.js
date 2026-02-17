import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
    AsyncStorage.setItem('roam_user', JSON.stringify(userData));
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    AsyncStorage.setItem('roam_user', JSON.stringify(updated));
  };

  const logout = () => {
    setUser(null);
    AsyncStorage.removeItem('roam_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
