// src/context/AuthContext/AuthProvider.tsx
import React, { useState, useEffect, ReactNode } from 'react';
import { User } from '../../types';
import { usersAPI } from '../../api/usersAPI';

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  user: User | null;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const init = async () => {
      const sessionUser = await usersAPI.getSession();
      if (sessionUser) {
        setUser(sessionUser);
        setIsAuthenticated(true);
        window.dispatchEvent(new Event('userChanged'));
      }
    };
    init();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const found = await usersAPI.find(username);
    if (found) {
      setIsAuthenticated(true);
      setUser(found);
      await usersAPI.saveSession(found);
      window.dispatchEvent(new Event('userChanged'));
      return true;
    }
    return false;
  };

  const register = async (username: string, password: string): Promise<boolean> => {
    if (!username.trim() || !password.trim()) return false;
    const added = await usersAPI.add({ username });
    if (added) {
      const newUser = { username };
      setIsAuthenticated(true);
      setUser(newUser);
      await usersAPI.saveSession(newUser);
      window.dispatchEvent(new Event('userChanged'));
      return true;
    }
    return false;
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setUser(null);
    await usersAPI.clearSession();
    window.dispatchEvent(new Event('userChanged'));
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    await usersAPI.update(user.username, updates);
    await usersAPI.saveSession(updated);
    setUser(updated);
    window.dispatchEvent(new Event('userChanged'));
  };

  const value: AuthContextType = {
    isAuthenticated,
    login,
    register,
    logout,
    user,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};