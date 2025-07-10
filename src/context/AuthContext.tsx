
import React, { createContext, useState, useEffect, useContext } from 'react';
import * as authService from '@/services/authService';
 
import { hasRole as hasRoleApi } from '@/utils/roleUtils';
import { API_BASE_URL } from '@/types/variables';

// Тип пользователя (можно расширить по необходимости)
type User = {
  id: number;
  email: string;
  name?: string;
  avatar_url?: string;
  roles?: string[]; // Добавляем роли
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile?: (updates: Partial<User>) => void;
  hasRole: (role: 'admin' | 'user' | 'editor') => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isLoading: true,
  isAuthenticated: false,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  hasRole: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Проверка токена при загрузке
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      authService.getMe(token)
        .then(res => setUser(res.user))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      localStorage.setItem('auth_token', res.token);
      setUser({
        ...res.user,
        roles: res.user.roles || [] // Добавляем роли в состояние
      });
      setLoading(false);
      return true;
    } catch (err) {
      setUser(null);
      setLoading(false);
      return false;
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    setLoading(true);
    try {
      const res = await authService.register(email, password, name);
      localStorage.setItem('auth_token', res.token);
      setUser(res.user);
      setLoading(false);
      return true;
    } catch (err) {
      setUser(null);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : prev);
  };

  const hasRole = async (role: 'admin' | 'user' | 'editor') => {
    console.log("Hello from hasRole  1")
    if (!user?.id) return false;
    const token = localStorage.getItem('auth_token');
    if (!token) return false;
    try {
      const response = await fetch(`${API_BASE_URL}/has-role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ user_id: user.id, role })
      });
      if (!response.ok) return false;
      const data = await response.json();
      return !!data.has_role;
    } catch (e) {
      console.error('Ошибка проверки роли:', e);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isLoading: loading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      updateProfile,
      hasRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
