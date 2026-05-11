// src/api/client.ts
const delay = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), 50));

export const storageClient = {
  getItem: async <T>(key: string): Promise<T | null> => {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
      return delay(JSON.parse(raw));
    } catch {
      return null;
    }
  },
  setItem: async <T>(key: string, value: T): Promise<void> => {
    localStorage.setItem(key, JSON.stringify(value));
    return delay(undefined);
  },
  removeItem: async (key: string): Promise<void> => {
    localStorage.removeItem(key);
    return delay(undefined);
  },
};