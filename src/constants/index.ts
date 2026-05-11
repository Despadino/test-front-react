// src/constants/index.ts
export const STORAGE_KEYS = {
  USERS: 'app_users',
  SESSION: 'app_current_user',
  DEV_MODE: 'dev_mode',
  USER_TEAM_PREFIX: 'user_team_',
  INVITES: 'app_invites',
  APPS: 'user_apps',           // для кастомных приложений
} as const;

export const ROUTES = {
  HOME: '/',
  STORE: '/store',
  LOGIN: '/login',
  REGISTER: '/register',
  FRIENDS: '/friends',
  SETTINGS: '/settings',
  DEV: '/dev',               // страница разработчика
  APP: '/app/:productId',
  APP_BASE: '/app',
} as const;

export const MENU_ITEMS = [
  { name: 'Магазин', path: ROUTES.STORE, emoji: '🛒' },
  { name: 'Разработка', path: ROUTES.DEV, emoji: '⚙️' },
] as const;

export const AUTH_HEADER_LINKS = [
  { to: ROUTES.STORE, label: 'Приложения' },
  { to: ROUTES.FRIENDS, label: 'Друзья' },
  { to: ROUTES.SETTINGS, label: 'Настройки' },
] as const;

export const GUEST_HEADER_LINKS = [
  { to: ROUTES.LOGIN, label: 'Войти' },
  { to: ROUTES.REGISTER, label: 'Регистрация' },
] as const;