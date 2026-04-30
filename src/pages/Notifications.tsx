import styles from './Notifications.module.css';

export default function Notifications() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Уведомления</h1>
      <div className={styles.list}>
        <div className={styles.notification}>🔔 Новое сообщение от Алексея</div>
        <div className={styles.notification}>🎉 Акция: скидка 20%</div>
        <div className={styles.notification}>👥 Приглашение в группу</div>
      </div>
    </div>
  );
}