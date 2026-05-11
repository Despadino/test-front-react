// src/pages/profile/ProfileView.tsx
import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { usersAPI } from '../../api/usersAPI';
import { subscriptionsAPI } from '../../api/subscriptionsAPI';
import { PRODUCTS } from '../../data/products';
import { ROUTES } from '../../constants';
import styles from './Profile.module.css';

export default function ProfileView() {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<{ username: string; isPrivate?: boolean } | null>(null);
  const [subscriptions, setSubscriptions] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;
    const load = async () => {
      const found = await usersAPI.find(username);
      if (found) {
        setUser(found);
        if (!found.isPrivate) {
          const subs = await subscriptionsAPI.get(username);
          setSubscriptions(subs);
        }
      }
      setLoading(false);
    };
    load();
  }, [username]);

  if (loading) return <div className="loading">Загрузка...</div>;
  if (!user) return <Navigate to={ROUTES.FRIENDS} replace />; // был TEAM

  const isPrivate = user.isPrivate === true;

  return (
    <div className="page-container">
      <h1 className="page-title">Профиль пользователя</h1>
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <div className={styles.avatar}>👤</div>
          <h2>{user.username}</h2>
          {isPrivate ? (
            <p className={styles.privateMessage}>Пользователь скрыл свой профиль.</p>
          ) : (
            <>
              <h3 className={styles.subscriptionsTitle}>Подписанные приложения:</h3>
              {subscriptions.length === 0 ? (
                <p className={styles.noSubscriptions}>Нет активных подписок</p>
              ) : (
                <div className={styles.subscriptionsList}>
                  {PRODUCTS.filter(p => subscriptions.includes(p.id)).map(product => (
                    <div key={product.id} className={styles.subscriptionItem}>
                      <span>{product.emoji}</span> {product.name}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}