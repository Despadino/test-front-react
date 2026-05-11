// src/api/usersAPI.ts
import { storageClient } from './client';
import { User } from '../types';
import { STORAGE_KEYS } from '../constants';

export const usersAPI = {
  getAll: async (): Promise<User[]> => {
    try {
      const users = await storageClient.getItem<User[]>(STORAGE_KEYS.USERS);
      return users || [];
    } catch (err) {
      console.error('usersAPI.getAll error:', err);
      return [];
    }
  },
  find: async (username: string): Promise<User | undefined> => {
    try {
      const users = await usersAPI.getAll();
      return users.find(u => u.username === username);
    } catch (err) {
      console.error('usersAPI.find error:', err);
      return undefined;
    }
  },
  add: async (user: User): Promise<boolean> => {
    try {
      const users = await usersAPI.getAll();
      if (users.find(u => u.username === user.username)) return false;
      const newUser = { ...user, balance: 1000 };
      users.push(newUser);
      await storageClient.setItem(STORAGE_KEYS.USERS, users);
      return true;
    } catch (err) {
      console.error('usersAPI.add error:', err);
      return false;
    }
  },
  update: async (username: string, updates: Partial<User>): Promise<boolean> => {
    try {
      const users = await usersAPI.getAll();
      const index = users.findIndex(u => u.username === username);
      if (index === -1) return false;
      users[index] = { ...users[index], ...updates };
      await storageClient.setItem(STORAGE_KEYS.USERS, users);
      return true;
    } catch (err) {
      console.error('usersAPI.update error:', err);
      return false;
    }
  },
  getSession: async (): Promise<User | null> => {
    try {
      return await storageClient.getItem<User>(STORAGE_KEYS.SESSION);
    } catch (err) {
      console.error('usersAPI.getSession error:', err);
      return null;
    }
  },
  saveSession: async (user: User): Promise<void> => {
    try {
      await storageClient.setItem(STORAGE_KEYS.SESSION, user);
    } catch (err) {
      console.error('usersAPI.saveSession error:', err);
    }
  },
  clearSession: async (): Promise<void> => {
    try {
      await storageClient.removeItem(STORAGE_KEYS.SESSION);
    } catch (err) {
      console.error('usersAPI.clearSession error:', err);
    }
  },
  updateBalance: async (username: string, delta: number): Promise<number> => {
    const user = await usersAPI.find(username);
    if (!user) throw new Error('User not found');
    const newBalance = (user.balance || 0) + delta;
    await usersAPI.update(username, { balance: newBalance });
    // обновляем сессию, если этот пользователь залогинен
    const session = await usersAPI.getSession();
    if (session?.username === username) {
      await usersAPI.saveSession({ ...session, balance: newBalance });
    }
    return newBalance;
  },
};