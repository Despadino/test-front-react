// src/pages/applications/Dev/DevPage.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { appsAPI } from '../../../api/appsAPI';
import { subscriptionsAPI } from '../../../api/subscriptionsAPI';
import { App, VisibilityType, MonetizationType } from '../../../types';
import styles from './DevPage.module.css';

// Компонент редактора приложения (создание/редактирование)
function AppEditor({ onSave, onCancel, initial }: { onSave: (app: any) => void; onCancel: () => void; initial?: any }) {
  const [name, setName] = useState(initial?.name || '');
  const [emoji, setEmoji] = useState(initial?.emoji || '📱');
  const [description, setDescription] = useState(initial?.description || '');
  const [visibilityType, setVisibilityType] = useState<VisibilityType>(initial?.visibilityType || 'public');
  const [visibilityCode, setVisibilityCode] = useState(initial?.visibilityCode || '');
  const [monetizationType, setMonetizationType] = useState<MonetizationType>(initial?.monetizationType || 'free');
  const [price, setPrice] = useState(initial?.price || 0);
  const [donationEnabled, setDonationEnabled] = useState(initial?.donationEnabled || false);
  const [donationGoal, setDonationGoal] = useState(initial?.donationGoal || '');

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave({
      name,
      emoji,
      description,
      visibilityType,
      visibilityCode: visibilityType === 'closed' ? visibilityCode : undefined,
      monetizationType,
      price: monetizationType !== 'free' ? price : undefined,
      donationEnabled,
      donationGoal: donationEnabled && donationGoal ? Number(donationGoal) : undefined,
    });
  };

  return (
    <div className={styles.editor}>
      <div className={styles.field}>
        <label>Название *</label>
        <input placeholder="Название" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div className={styles.field}>
        <label>Эмодзи</label>
        <input placeholder="😀" value={emoji} onChange={e => setEmoji(e.target.value)} />
      </div>
      <div className={styles.field}>
        <label>Описание</label>
        <textarea placeholder="Описание" value={description} onChange={e => setDescription(e.target.value)} rows={3} />
      </div>
      <div className={styles.field}>
        <label>Видимость</label>
        <select value={visibilityType} onChange={e => setVisibilityType(e.target.value as VisibilityType)}>
          <option value="public">Публичное</option>
          <option value="closed">Закрытое (по коду)</option>
        </select>
      </div>
      {visibilityType === 'closed' && (
        <div className={styles.field}>
          <label>Код доступа</label>
          <input placeholder="Код" value={visibilityCode} onChange={e => setVisibilityCode(e.target.value)} />
        </div>
      )}
      <div className={styles.field}>
        <label>Монетизация</label>
        <select value={monetizationType} onChange={e => setMonetizationType(e.target.value as MonetizationType)}>
          <option value="free">Бесплатно</option>
          <option value="onetime">Разовая покупка</option>
          <option value="subscription">Подписка (ежемесячно)</option>
        </select>
      </div>
      {(monetizationType === 'onetime' || monetizationType === 'subscription') && (
        <div className={styles.field}>
          <label>Цена (монеты)</label>
          <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} />
        </div>
      )}
      <div className={styles.field}>
        <label className={styles.checkbox}>
          <input type="checkbox" checked={donationEnabled} onChange={e => setDonationEnabled(e.target.checked)} />
          Включить донат
        </label>
      </div>
      {donationEnabled && (
        <div className={styles.field}>
          <label>Цель сбора (монеты, необязательно)</label>
          <input type="number" placeholder="Оставьте пустым для безлимита" value={donationGoal} onChange={e => setDonationGoal(e.target.value)} />
        </div>
      )}
      <div className={styles.actions}>
        <button className={styles.saveBtn} onClick={handleSubmit}>Сохранить</button>
        <button className={styles.cancelBtn} onClick={onCancel}>Отмена</button>
      </div>
    </div>
  );
}

export default function DevPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [myApps, setMyApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [subscribersCount, setSubscribersCount] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      const apps = await appsAPI.getByCreator(user.username);
      setMyApps(apps);
      const counts: { [key: number]: number } = {};
      for (const app of apps) {
        counts[app.id] = await subscriptionsAPI.getSubscribersCount(app.id);
      }
      setSubscribersCount(counts);
      setLoading(false);
    };
    load();
  }, [user]);

  const handleCreate = async (appData: any) => {
    if (!user) return;
    const newApp = await appsAPI.add({
      creatorUsername: user.username,
      isPublished: true,
      createdAt: Date.now(),
      donationCurrent: 0,
      ...appData,
    });
    setMyApps(prev => [...prev, newApp]);
    setShowEditor(false);
    showToast(`Приложение "${newApp.name}" создано и доступно в магазине!`);
  };

  const handleUpdate = async (appData: any) => {
    if (!selectedApp) return;
    await appsAPI.update(selectedApp.id, appData);
    setMyApps(prev => prev.map(a => a.id === selectedApp.id ? { ...a, ...appData } : a));
    setSelectedApp(null);
    showToast(`Приложение обновлено`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Удалить приложение? Оно исчезнет из магазина у всех пользователей.')) {
      await appsAPI.delete(id);
      setMyApps(prev => prev.filter(a => a.id !== id));
      showToast('Приложение удалено');
    }
  };

  const handlePublish = async (app: App) => {
    showToast(`Приложение "${app.name}" отправлено на проверку. Обычно это занимает 24 часа.`);
    // Здесь можно добавить логику изменения статуса публикации
  };

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div className="page-container">
      <h1 className="page-title">🧪 Разработка</h1>
      <div className={styles.devContainer}>
        <button className={styles.createButton} onClick={() => setShowEditor(true)}>+ Создать приложение</button>
        {myApps.length === 0 && <p className={styles.empty}>У вас пока нет приложений. Нажмите «Создать».</p>}
        <div className={styles.appsList}>
          {myApps.map(app => (
            <div key={app.id} className={styles.appCard}>
              <div className={styles.appHeader}>
                <span className={styles.emoji}>{app.emoji}</span>
                <span className={styles.appName}>{app.name}</span>
                <span className={styles.downloads}>⬇️ {subscribersCount[app.id] || 0}</span>
              </div>
              <div className={styles.appDetails}>
                <div>📁 {app.visibilityType === 'public' ? 'Публичное' : 'Закрытое'}</div>
                <div>
                  💳 {app.monetizationType === 'free' ? 'Бесплатно' :
                      app.monetizationType === 'onetime' ? `Разовая покупка, ${app.price} монет` :
                      `Подписка, ${app.price} монет/мес`}
                  {app.donationEnabled && ' + 🎁 Донат'}
                </div>
              </div>
              <div className={styles.appActions}>
                <button onClick={() => setSelectedApp(app)}>✏️ Редактировать</button>
                <button onClick={() => handleDelete(app.id)}>🗑️ Удалить</button>
                <button onClick={() => handlePublish(app)}>📤 Опубликовать (проверка)</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {(showEditor || selectedApp) && (
        <div className={styles.modalOverlay} onClick={() => { setShowEditor(false); setSelectedApp(null); }}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3>{selectedApp ? 'Редактирование' : 'Новое приложение'}</h3>
            <AppEditor
              initial={selectedApp || undefined}
              onSave={selectedApp ? handleUpdate : handleCreate}
              onCancel={() => { setShowEditor(false); setSelectedApp(null); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}