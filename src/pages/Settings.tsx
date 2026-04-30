import { useState } from 'react';
import styles from './Settings.module.css';

export default function Settings() {
  const [notifications, setNotifications] = useState(true);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Настройки интерфейса</h2>
        <div className={styles.settingItem}>
          <span>Уведомления</span>
          <div
            className={`${styles.toggle} ${notifications ? styles.active : ''}`}
            onClick={() => setNotifications(!notifications)}
          />
        </div>
        {/* Удалён блок с "Тёмная тема (активна)" */}
      </div>
    </div>
  );
}