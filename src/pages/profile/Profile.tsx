// src/pages/profile/Profile.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button/Button';
import { useAuth } from '../../context/AuthContext';
import { PRODUCTS } from '../../data/products';
import { subscriptionsAPI } from '../../api/subscriptionsAPI';
import styles from './Profile.module.css';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      subscriptionsAPI.get(user.username).then(subs => {
        setSubscriptions(subs);
        setLoading(false);
      });
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) return <div className="loading">Загрузка профиля...</div>;

  return (
    <div className="page-container">
      <h1 className="page-title">Мой профиль</h1>
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <div className={styles.avatar}>🌙</div>
          <h2>{user?.username || 'Пользователь'}</h2>
          <h3 className={styles.subscriptionsTitle}>Мои подписки:</h3>
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
          <Button onClick={handleLogout} className={styles.logoutButton}>Выйти</Button>
        </div>
      </div>
    </div>
  );
}