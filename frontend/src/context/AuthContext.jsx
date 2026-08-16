// ============================================================
// src/context/AuthContext.jsx
// ============================================================
// Provides auth state, login, logout, register across the entire app.
// Stores JWT in localStorage using the keys defined in constants.js.
// Reads token on mount to persist sessions across refreshes.

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { TOKEN_KEY, USER_KEY } from '../utils/constants';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);
  const [loading, setLoading] = useState(true);

  // On first mount, validate the stored token with the backend
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await authService.getMe();
        if (data.success) {
          setUser(data.user);
          localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        } else {
          clearAuth();
        }
      } catch {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };
    validateToken();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const saveAuth = useCallback((tokenValue, userValue) => {
    setToken(tokenValue);
    setUser(userValue);
    localStorage.setItem(TOKEN_KEY, tokenValue);
    localStorage.setItem(USER_KEY, JSON.stringify(userValue));
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);
    if (data.success) {
      saveAuth(data.token, data.user);
    }
    return data;
  }, [saveAuth]);

  const register = useCallback(async (formData) => {
    const data = await authService.register(formData);
    if (data.success) {
      saveAuth(data.token, data.user);
    }
    return data;
  }, [saveAuth]);

  const logout = useCallback(() => {
    clearAuth();
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

export default AuthContext;
