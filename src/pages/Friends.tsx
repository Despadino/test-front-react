import styles from './Friends.module.css';

export default function Friends() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Друзья</h1>
      <div className={styles.list}>
        <div className={styles.friendCard}>
          <span>👤</span> <span>Алексей</span>
        </div>
        <div className={styles.friendCard}>
          <span>👤</span> <span>Мария</span>
        </div>
        <div className={styles.friendCard}>
          <span>👤</span> <span>Дмитрий</span>
        </div>
      </div>
    </div>
  );
}