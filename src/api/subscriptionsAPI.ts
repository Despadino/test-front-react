// src/api/subscriptionsAPI.ts
import { storageClient } from './client';
import { appsAPI } from './appsAPI';
import { usersAPI } from './usersAPI';

const getKey = (username: string) => `subscriptions_${username}`;

const getAllSubscriptions = async (): Promise<{ [username: string]: number[] }> => {
  const key = 'all_subscriptions';
  const data = await storageClient.getItem<{ [username: string]: number[] }>(key);
  return data || {};
};

const saveAllSubscriptions = async (data: { [username: string]: number[] }) => {
  await storageClient.setItem('all_subscriptions', data);
};

export const subscriptionsAPI = {
  get: async (username: string): Promise<number[]> => {
    try {
      const all = await getAllSubscriptions();
      return all[username] || [];
    } catch (err) {
      console.error('subscriptionsAPI.get error:', err);
      return [];
    }
  },
  set: async (username: string, subscriptions: number[]): Promise<void> => {
    try {
      const all = await getAllSubscriptions();
      all[username] = subscriptions;
      await saveAllSubscriptions(all);
    } catch (err) {
      console.error('subscriptionsAPI.set error:', err);
    }
  },
  // получить количество подписчиков приложения
  getSubscribersCount: async (appId: number): Promise<number> => {
    const all = await getAllSubscriptions();
    let count = 0;
    for (const subs of Object.values(all)) {
      if (subs.includes(appId)) count++;
    }
    return count;
  },
  subscribe: async (username: string, appId: number, code?: string, donation?: number): Promise<{ success: boolean; message: string; needCode?: boolean }> => {
    const app = await appsAPI.getById(appId);
    if (!app) return { success: false, message: 'Приложение не найдено' };

    const subs = await subscriptionsAPI.get(username);
    const isCurrentlySubscribed = subs.includes(appId);

    // Отписка
    if (isCurrentlySubscribed) {
      const newSubs = subs.filter(id => id !== appId);
      await subscriptionsAPI.set(username, newSubs);
      return { success: true, message: `Вы отписались от ${app.name}` };
    }

    // Подписка
    // Проверка кода доступа
    if (app.visibilityType === 'closed') {
      if (!code) return { success: false, message: 'Требуется код доступа', needCode: true };
      if (code !== app.visibilityCode) return { success: false, message: 'Неверный код доступа' };
    }

    const user = await usersAPI.find(username);
    if (!user) return { success: false, message: 'Пользователь не найден' };
    let balance = user.balance || 0;

    // Стоимость подписки/покупки
    let cost = 0;
    if (app.monetizationType === 'onetime' || app.monetizationType === 'subscription') {
      cost = app.price || 0;
    }
    if (cost > balance) return { success: false, message: 'Недостаточно монет' };

    // Донат
    let donationAmount = 0;
    if (app.donationEnabled && donation && donation > 0) {
      donationAmount = donation;
      if (donationAmount > balance - cost) return { success: false, message: 'Недостаточно монет для доната' };
    }

    // Списание
    const totalCost = cost + donationAmount;
    if (totalCost > 0) {
      await usersAPI.updateBalance(username, -totalCost);
    }
    if (donationAmount > 0) {
      await appsAPI.addDonation(appId, donationAmount);
    }

    // Добавление в подписки
    const newSubs = [...subs, appId];
    await subscriptionsAPI.set(username, newSubs);

    let message = `Вы подписались на ${app.name}`;
    if (cost > 0) message += ` за ${cost} монет`;
    if (donationAmount > 0) message += ` и пожертвовали ${donationAmount} монет`;
    return { success: true, message };
  },
  // старые методы для совместимости (если используются)
  add: async (username: string, productId: number): Promise<void> => {
    const subs = await subscriptionsAPI.get(username);
    if (!subs.includes(productId)) {
      subs.push(productId);
      await subscriptionsAPI.set(username, subs);
    }
  },
  remove: async (username: string, productId: number): Promise<void> => {
    const subs = await subscriptionsAPI.get(username);
    const newSubs = subs.filter(id => id !== productId);
    await subscriptionsAPI.set(username, newSubs);
  },
};