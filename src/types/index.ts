// src/types/index.ts
export interface User {
  username: string;
  balance?: number;
}

export interface Invite {
  id: string;
  from: string;
  to: string;
  type: 'team';
  status: 'pending' | 'accepted' | 'declined';
  createdAt: number;
}

export type VisibilityType = 'public' | 'closed';
export type MonetizationType = 'free' | 'onetime' | 'subscription';

export interface App {
  id: number;
  creatorUsername: string;
  name: string;
  emoji: string;
  description: string;
  visibilityType: VisibilityType;
  visibilityCode?: string;
  monetizationType: MonetizationType;
  price?: number;               // для onetime / subscription
  donationEnabled: boolean;     // донат доступен
  donationGoal?: number;        // цель сбора (опционально)
  donationCurrent?: number;     // собрано (при донатах)
  createdAt: number;
  isPublished: boolean;         // для имитации проверки – всегда true при создании
}