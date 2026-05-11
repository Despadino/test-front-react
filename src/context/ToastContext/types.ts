// src/context/ToastContext/types.ts
export interface ToastMessage {
  id: string;
  text: string;
}

export interface ToastContextType {
  showToast: (text: string) => void;
}