// src/components/Sidebar/Sidebar.tsx
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { STORAGE_KEYS, ROUTES } from '../../constants';
import { subscriptionsAPI } from '../../api/subscriptionsAPI';
import { useAuth } from '../../context/AuthContext';
import { PRODUCTS } from '../../data/products';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const { user } = useAuth();
  const [devMode, setDevMode] = useState(false);
  const [subscriptions, setSubscriptions] = useState<number[]>([]);

  // Следим за режимом разработчика
  useEffect(() => {
    const checkDevMode = () => {
      const saved = localStorage.getItem(STORAGE_KEYS.DEV_MODE);
      setDevMode(saved === 'true');
    };
    checkDevMode();
    window.addEventListener('devModeChanged', checkDevMode as EventListener);
    return () => {
      window.removeEventListener('devModeChanged', checkDevMode as EventListener);
    };
  }, []);

  // Загружаем подписки пользователя
  useEffect(() => {
    if (!user) return;
    const loadSubscriptions = async () => {
      const subs = await subscriptionsAPI.get(user.username);
      setSubscriptions(subs);
    };
    loadSubscriptions();

    const handleUserChanged = () => loadSubscriptions();
    window.addEventListener('userChanged', handleUserChanged);
    return () => window.removeEventListener('userChanged', handleUserChanged);
  }, [user]);

  // Магазин виден всегда, Разработка – только при включённом devMode
  const staticMenuItems = [
    { name: 'Магазин', path: ROUTES.STORE, emoji: '🛒' },
  ];
  if (devMode) {
    staticMenuItems.push({ name: 'Разработка', path: ROUTES.DEV, emoji: '⚙️' });
  }

  const subscribedProducts = PRODUCTS.filter(p => subscriptions.includes(p.id));

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarInner}>
        <div className={styles.logo}>✦ Nebula</div>
        <nav>
          <ul className={styles.navList}>
            {staticMenuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.active : ''}`
                  }
                >
                  <span>{item.emoji}</span>
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
            {subscribedProducts.length > 0 && (
              <li className={styles.divider}>—— Мои приложения ——</li>
            )}
            {subscribedProducts.map(product => (
              <li key={product.id}>
                <NavLink
                  to={`${ROUTES.APP_BASE}/${product.id}`}
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.active : ''}`
                  }
                >
                  <span>{product.emoji}</span>
                  <span>{product.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}