// src/data/initApps.ts
import { App } from '../types';
import { appsAPI } from '../api/appsAPI';

const DEFAULT_APPS: Omit<App, 'id'>[] = [
  { creatorUsername: 'system', name: 'Чат', emoji: '💬', description: 'Мгновенные сообщения, группы и стикеры.', visibilityType: 'public', monetizationType: 'free', donationEnabled: false, isPublished: true, createdAt: Date.now() },
  { creatorUsername: 'system', name: 'Календарь', emoji: '📅', description: 'Планируйте события и встречи.', visibilityType: 'public', monetizationType: 'free', donationEnabled: false, isPublished: true, createdAt: Date.now() },
  { creatorUsername: 'system', name: 'Заметки', emoji: '📝', description: 'Быстрые заметки и списки дел.', visibilityType: 'public', monetizationType: 'free', donationEnabled: false, isPublished: true, createdAt: Date.now() },
  { creatorUsername: 'system', name: 'Погода', emoji: '☀️', description: 'Прогноз погоды на неделю.', visibilityType: 'public', monetizationType: 'free', donationEnabled: false, isPublished: true, createdAt: Date.now() },
  { creatorUsername: 'system', name: 'Карты', emoji: '🗺️', description: 'Навигация и поиск мест.', visibilityType: 'public', monetizationType: 'free', donationEnabled: false, isPublished: true, createdAt: Date.now() },
  { creatorUsername: 'system', name: 'Музыка', emoji: '🎵', description: 'Стриминг любимых треков.', visibilityType: 'public', monetizationType: 'free', donationEnabled: false, isPublished: true, createdAt: Date.now() },
  { creatorUsername: 'system', name: 'Видеоплеер', emoji: '🎬', description: 'Просмотр фильмов и роликов.', visibilityType: 'public', monetizationType: 'free', donationEnabled: false, isPublished: true, createdAt: Date.now() },
  { creatorUsername: 'system', name: 'Фотогалерея', emoji: '🖼️', description: 'Храните и редактируйте фото.', visibilityType: 'public', monetizationType: 'free', donationEnabled: false, isPublished: true, createdAt: Date.now() },
  { creatorUsername: 'system', name: 'Будильник', emoji: '⏰', description: 'Умные напоминания.', visibilityType: 'public', monetizationType: 'free', donationEnabled: false, isPublished: true, createdAt: Date.now() },
  { creatorUsername: 'system', name: 'Калькулятор', emoji: '🧮', description: 'Все необходимые вычисления.', visibilityType: 'public', monetizationType: 'free', donationEnabled: false, isPublished: true, createdAt: Date.now() },
];

export const initApps = async () => {
  const existing = await appsAPI.getAll();
  if (existing.length === 0) {
    for (const app of DEFAULT_APPS) {
      await appsAPI.add(app);
    }
  }
}