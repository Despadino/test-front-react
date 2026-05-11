// src/pages/applications/Store/Store.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { subscriptionsAPI } from '../../../api/subscriptionsAPI';
import { appsAPI } from '../../../api/appsAPI';
import { App } from '../../../types';
import { ROUTES } from '../../../constants';
import styles from './Store.module.css';

export default function Store() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'subscribed'>('all');
  const [apps, setApps] = useState<App[]>([]);
  const [subscriptions, setSubscriptions] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      const allApps = await appsAPI.getAll();
      const publishedApps = allApps.filter(app => app.isPublished);
      setApps(publishedApps);
      const subs = await subscriptionsAPI.get(user.username);
      setSubscriptions(subs);
      setLoading(false);
    };
    load();

    const handleUserChanged = () => load();
    window.addEventListener('userChanged', handleUserChanged);
    return () => window.removeEventListener('userChanged', handleUserChanged);
  }, [user]);

  const isSubscribed = (appId: number) => subscriptions.includes(appId);

  const handleCardClick = (appId: number) => {
    navigate(`${ROUTES.STORE}/product/${appId}`);
  };

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 'subscribed') {
      return matchesSearch && isSubscribed(app.id);
    }
    return matchesSearch;
  });

  if (loading) return <div className="loading">Загрузка магазина...</div>;

  return (
    <div className="page-container">
      <h1 className="page-title">Магазин</h1>
      <input
        type="text"
        placeholder="Поиск приложений..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.searchInput}
      />
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'all' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('all')}
        >
          Витрина
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'subscribed' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('subscribed')}
        >
          Подписки
        </button>
      </div>
      <div className={styles.grid}>
        {filteredApps.map((app) => (
          <div key={app.id} className={styles.card} onClick={() => handleCardClick(app.id)}>
            <div className={styles.emoji}>{app.emoji}</div>
            <h3>{app.name}</h3>
            <div className={styles.price}>
              {app.monetizationType === 'free' ? 'Бесплатно' :
               app.monetizationType === 'onetime' ? `${app.price} монет` :
               `${app.price} монет/мес`}
            </div>
            <div className={styles.subscribeStatus}>
              {isSubscribed(app.id) && <span className={styles.subscribed}>Подписан</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}