import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface User {
  username: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  register: (username: string, password: string) => boolean;
  logout: () => void;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'app_users';
const SESSION_KEY = 'app_current_user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem(SESSION_KEY);
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      setIsAuthenticated(true);
    }
  }, []);

  const getUsers = (): User[] => {
    const users = localStorage.getItem(STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  };

  const saveUsers = (users: User[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  };

  const login = (username: string, password: string): boolean => {
    const users = getUsers();
    const found = users.find(u => u.username === username);
    if (found) {
      setIsAuthenticated(true);
      setUser(found);
      localStorage.setItem(SESSION_KEY, JSON.stringify(found));
      return true;
    }
    return false;
  };

  const register = (username: string, password: string): boolean => {
    if (!username.trim() || !password.trim()) return false;
    const users = getUsers();
    if (users.find(u => u.username === username)) return false;
    const newUser = { username };
    users.push(newUser);
    saveUsers(users);
    setIsAuthenticated(true);
    setUser(newUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};