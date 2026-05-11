// src/api/appsAPI.ts
import { storageClient } from './client';
import { App, VisibilityType, MonetizationType } from '../types';
import { STORAGE_KEYS } from '../constants';

export const appsAPI = {
  getAll: async (): Promise<App[]> => {
    try {
      const apps = await storageClient.getItem<App[]>(STORAGE_KEYS.APPS);
      return apps || [];
    } catch (err) {
      console.error('appsAPI.getAll error:', err);
      return [];
    }
  },
  getById: async (id: number): Promise<App | undefined> => {
    const apps = await appsAPI.getAll();
    return apps.find(a => a.id === id);
  },
  getByCreator: async (username: string): Promise<App[]> => {
    const apps = await appsAPI.getAll();
    return apps.filter(a => a.creatorUsername === username);
  },
  add: async (app: Omit<App, 'id'>): Promise<App> => {
    const apps = await appsAPI.getAll();
    const newId = Math.max(0, ...apps.map(a => a.id), 0) + 1;
    const newApp = { ...app, id: newId, donationCurrent: 0 };
    apps.push(newApp);
    await storageClient.setItem(STORAGE_KEYS.APPS, apps);
    return newApp;
  },
  update: async (id: number, updates: Partial<App>): Promise<void> => {
    const apps = await appsAPI.getAll();
    const index = apps.findIndex(a => a.id === id);
    if (index !== -1) {
      apps[index] = { ...apps[index], ...updates };
      await storageClient.setItem(STORAGE_KEYS.APPS, apps);
    }
  },
  delete: async (id: number): Promise<void> => {
    let apps = await appsAPI.getAll();
    apps = apps.filter(a => a.id !== id);
    await storageClient.setItem(STORAGE_KEYS.APPS, apps);
  },
  addDonation: async (appId: number, amount: number): Promise<number> => {
    const app = await appsAPI.getById(appId);
    if (!app || !app.donationEnabled) return 0;
    const newCurrent = (app.donationCurrent || 0) + amount;
    await appsAPI.update(appId, { donationCurrent: newCurrent });
    return newCurrent;
  },
};