// src/api/friendsAPI.ts
import { storageClient } from './client';
import { STORAGE_KEYS } from '../constants';

const getKey = (username: string) => STORAGE_KEYS.USER_TEAM_PREFIX + username;

export const friendsAPI = {
  get: async (username: string): Promise<string[]> => {
    try {
      const team = await storageClient.getItem<string[]>(getKey(username));
      return team || [];
    } catch (err) {
      console.error('friendsAPI.get error:', err);
      return [];
    }
  },
  set: async (username: string, friends: string[]): Promise<void> => {
    try {
      await storageClient.setItem(getKey(username), friends);
    } catch (err) {
      console.error('friendsAPI.set error:', err);
    }
  },
  add: async (currentUser: string, targetUser: string): Promise<boolean> => {
    try {
      const friends = await friendsAPI.get(currentUser);
      if (friends.includes(targetUser)) return false;
      friends.push(targetUser);
      await friendsAPI.set(currentUser, friends);
      return true;
    } catch (err) {
      console.error('friendsAPI.add error:', err);
      return false;
    }
  },
  remove: async (currentUser: string, targetUser: string): Promise<boolean> => {
    try {
      let friends = await friendsAPI.get(currentUser);
      if (!friends.includes(targetUser)) return false;
      friends = friends.filter(u => u !== targetUser);
      await friendsAPI.set(currentUser, friends);
      return true;
    } catch (err) {
      console.error('friendsAPI.remove error:', err);
      return false;
    }
  },
  isFriend: async (currentUser: string, targetUser: string): Promise<boolean> => {
    const friends = await friendsAPI.get(currentUser);
    return friends.includes(targetUser);
  },
};