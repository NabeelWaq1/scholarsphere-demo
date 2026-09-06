import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('scholarsphere_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('scholarsphere_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
        } catch (error) {
          console.error('Session restoration failed:', error);
          localStorage.removeItem('scholarsphere_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('scholarsphere_token', newToken);
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const signup = async (formData) => {
    const res = await api.post('/auth/signup', formData);
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('scholarsphere_token', newToken);
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('scholarsphere_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
      return res.data;
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const updateStudentProfile = async (profileData) => {
    const res = await api.put('/students/profile', profileData);
    await refreshUser();
    return res.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        refreshUser,
        updateStudentProfile,
        isAuthenticated: !!user,
        isStudent: user?.role === 'student',
        isMentor: user?.role === 'mentor'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
