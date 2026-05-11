// src/pages/settings/Settings.tsx (упрощён)
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button/Button';
import { useNavigate } from 'react-router-dom';
import { ROUTES, STORAGE_KEYS } from '../../constants';
import styles from './Settings.module.css';

function ProfileTab() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className={styles.profileContent}>
      <div className={styles.avatar}>🌙</div>
      <h2>{user?.username || 'Пользователь'}</h2>
      <div className={styles.balance}>💰 Баланс: {user?.balance ?? 0} монет</div>
      <Button onClick={handleLogout} className={styles.logoutButton}>Выйти</Button>
    </div>
  );
}

function SystemTab() {
  const { showToast } = useToast();
  const [devMode, setDevMode] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DEV_MODE);
    return saved === 'true';
  });

  const toggleDevMode = () => {
    const newValue = !devMode;
    setDevMode(newValue);
    localStorage.setItem(STORAGE_KEYS.DEV_MODE, String(newValue));
    window.dispatchEvent(new CustomEvent('devModeChanged', { detail: newValue }));
    showToast(newValue ? '⚙️ Режим разработчика включён' : '⚙️ Режим разработчика выключен');
  };

  return (
    <div className={styles.systemContent}>
      <div className={styles.settingItem}>
        <span>Режим разработчика</span>
        <div
          className={`${styles.toggle} ${devMode ? styles.active : ''}`}
          onClick={toggleDevMode}
        />
      </div>
      <p className={styles.hint}>Показывает вкладку «Разработка» в магазине и дополнительные возможности.</p>
    </div>
  );
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'profile' | 'system'>('profile');

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'profile' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Профиль
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'system' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('system')}
        >
          Система
        </button>
      </div>
      <div className={styles.card}>
        {activeTab === 'profile' ? <ProfileTab /> : <SystemTab />}
      </div>
    </div>
  );
}