import { createContext, useContext, useState, useEffect } from 'react';
import api from './axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const userId = localStorage.getItem('userId');
    const email = localStorage.getItem('userEmail');
    const accessToken = localStorage.getItem('accessToken');
    return userId && accessToken ? { userId, email: email || '' } : null;
  });

  const login = (userId, tokens, email = '') => {
    localStorage.setItem('accessToken', tokens.accessToken);
    if (tokens.refreshToken) {
      localStorage.setItem('refreshToken', tokens.refreshToken);
    }
    localStorage.setItem('userId', userId);
    if (email) {
      localStorage.setItem('userEmail', email);
    }
    setUser({ userId, email });
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore failure on logout call
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
