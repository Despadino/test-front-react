// src/pages/applications/AppPage/AppPage.tsx
import { useParams, Navigate } from 'react-router-dom';
import { PRODUCTS } from '../../../data/products';
import { useAuth } from '../../../context/AuthContext';
import { subscriptionsAPI } from '../../../api/subscriptionsAPI';
import { useEffect, useState } from 'react';
import { ROUTES } from '../../../constants';
import styles from './AppPage.module.css';

export default function AppPage() {
  const { productId } = useParams<{ productId: string }>();
  const { user } = useAuth();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user || !productId) return;
    const checkAccess = async () => {
      const subs = await subscriptionsAPI.get(user.username);
      const id = parseInt(productId, 10);
      setHasAccess(subs.includes(id));
    };
    checkAccess();
  }, [user, productId]);

  if (hasAccess === null) return <div className="loading">Загрузка...</div>;
  if (!hasAccess) return <Navigate to={ROUTES.STORE} replace />;

  const product = PRODUCTS.find(p => p.id === parseInt(productId!, 10));
  if (!product) return <Navigate to={ROUTES.STORE} replace />;

  return (
    <div className="page-container">
      <h1 className="page-title">{product.name}</h1>
      <div className={styles.appCard}>
        <div className={styles.emoji}>{product.emoji}</div>
        <p className={styles.description}>{product.description}</p>
        <div className={styles.placeholder}>
          Здесь будет интерфейс приложения «{product.name}».
        </div>
      </div>
    </div>
  );
}