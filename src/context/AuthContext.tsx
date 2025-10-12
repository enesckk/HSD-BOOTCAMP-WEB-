'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Admin, LoginRequest, RegisterRequest } from '@/types/user';
import { authService } from '@/services/auth';
import { STORAGE_KEYS } from '@/utils/constants';

interface AuthContextType {
  user: User | Admin | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<User | Admin>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  checkMarathonId: (marathonId: string) => Promise<{ available: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        
        console.log('Auth init - Token:', token ? 'Present' : 'Missing');
        console.log('Auth init - StoredUser:', storedUser ? 'Present' : 'Missing');
        
        if (token && storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            console.log('Auth init - Parsed user:', parsedUser);
            setUser(parsedUser);
            // Token verification yapmıyoruz, sadece stored user ile devam ediyoruz
          } catch (error) {
            // Stored user bozuksa yalnızca user'ı resetle, storage'ı temizleme
            console.log('Failed to parse stored user:', error);
            setUser(null);
          }
        } else {
          console.log('No token or stored user found');
        }
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      setUser(response.user);
      
      return response.user;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData);
      
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
    authService.logout().catch(() => {});
  };

  const checkMarathonId = async (marathonId: string) => {
    return await authService.checkMarathonId(marathonId);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    checkMarathonId,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};




