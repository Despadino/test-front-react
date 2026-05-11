// src/api/invitesAPI.ts
import { storageClient } from './client';
import { Invite } from '../types';
import { STORAGE_KEYS } from '../constants';

export const invitesAPI = {
  getAll: async (): Promise<Invite[]> => {
    try {
      const invites = await storageClient.getItem<Invite[]>(STORAGE_KEYS.INVITES);
      return invites || [];
    } catch (err) {
      console.error('invitesAPI.getAll error:', err);
      return [];
    }
  },
  add: async (invite: Invite): Promise<void> => {
    try {
      const invites = await invitesAPI.getAll();
      invites.push(invite);
      await storageClient.setItem(STORAGE_KEYS.INVITES, invites);
    } catch (err) {
      console.error('invitesAPI.add error:', err);
    }
  },
  update: async (id: string, status: 'accepted' | 'declined'): Promise<void> => {
    try {
      const invites = await invitesAPI.getAll();
      const index = invites.findIndex(i => i.id === id);
      if (index !== -1) {
        invites[index].status = status;
        await storageClient.setItem(STORAGE_KEYS.INVITES, invites);
      }
    } catch (err) {
      console.error('invitesAPI.update error:', err);
    }
  },
  getPendingForUser: async (username: string): Promise<Invite[]> => {
    const invites = await invitesAPI.getAll();
    return invites.filter(i => i.to === username && i.status === 'pending');
  },
};