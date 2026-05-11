// src/pages/applications/StoreProductPage/StoreProductPage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { appsAPI } from '../../../api/appsAPI';
import { subscriptionsAPI } from '../../../api/subscriptionsAPI';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { ROUTES } from '../../../constants';
import styles from './StoreProductPage.module.css';

export default function StoreProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [app, setApp] = useState<any>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [donationAmount, setDonationAmount] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);

  useEffect(() => {
    if (!user || !productId) return;
    const load = async () => {
      const appData = await appsAPI.getById(Number(productId));
      if (!appData) {
        navigate(ROUTES.STORE);
        return;
      }
      setApp(appData);
      const subs = await subscriptionsAPI.get(user.username);
      setIsSubscribed(subs.includes(appData.id));
      const count = await subscriptionsAPI.getSubscribersCount(appData.id);
      setSubscribersCount(count);
      setLoading(false);
    };
    load();
  }, [user, productId, navigate]);

  const handleSubscribe = async () => {
    if (!user || !app) return;
    const donation = donationAmount ? Number(donationAmount) : undefined;
    const result = await subscriptionsAPI.subscribe(
      user.username,
      app.id,
      showCodeInput ? code : undefined,
      donation
    );
    if (result.needCode) {
      setShowCodeInput(true);
      return;
    }
    showToast(result.message);
    if (result.success) {
      if (result.message.includes('отписались')) setIsSubscribed(false);
      else if (result.message.includes('подписались')) setIsSubscribed(true);
      // обновляем баланс пользователя через событие
      window.dispatchEvent(new Event('userChanged'));
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (!app) return null;

  const getMonetizationText = () => {
    let base = '';
    switch (app.monetizationType) {
      case 'free': base = 'Бесплатно'; break;
      case 'onetime': base = `${app.price} монет (разово)`; break;
      case 'subscription': base = `${app.price} монет / месяц`; break;
    }
    if (app.donationEnabled) base += ' + донат (добровольно)';
    return base;
  };

  return (
    <div className="page-container">
      <button className={styles.backButton} onClick={() => navigate(ROUTES.STORE)}>
        ← Назад в магазин
      </button>
      <div className={styles.productCard}>
        <div className={styles.emoji}>{app.emoji}</div>
        <h1 className={styles.title}>{app.name}</h1>
        <div className={styles.creator}>Разработчик: {app.creatorUsername}</div>
        <div className={styles.price}>{getMonetizationText()}</div>
        <div className={styles.stats}>⬇️ {subscribersCount} подписчиков</div>
        {app.donationEnabled && app.donationGoal && (
          <div className={styles.donationGoal}>🎯 Собрано {app.donationCurrent || 0} / {app.donationGoal} монет</div>
        )}
        <p className={styles.description}>{app.description}</p>

        {app.visibilityType === 'closed' && !isSubscribed && showCodeInput && (
          <input
            type="text"
            placeholder="Код доступа"
            value={code}
            onChange={e => setCode(e.target.value)}
            className={styles.codeInput}
          />
        )}
        {app.donationEnabled && !isSubscribed && (
          <input
            type="number"
            placeholder="Сумма доната (монеты)"
            value={donationAmount}
            onChange={e => setDonationAmount(e.target.value)}
            className={styles.donationInput}
          />
        )}
        <button className={styles.subscribeButton} onClick={handleSubscribe}>
          {isSubscribed ? 'Отписаться' : 'Подписаться'}
        </button>
      </div>
    </div>
  );
}