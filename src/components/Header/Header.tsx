import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Header.module.css';

export default function Header() {
  const { isAuthenticated, user } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.logo}>✦ Nebula</div>
      <div className={styles.right}>
        {isAuthenticated ? (
          <>
            <span className={styles.userEmail}>{user?.username}</span>
            <Link to="/friends" className={styles.navLink}>Друзья</Link>
            <Link to="/notifications" className={styles.navLink}>Уведомления</Link>
            <Link to="/profile" className={styles.navLink}>Профиль</Link>
            <Link to="/settings" className={styles.navLink}>Настройки</Link>
          </>
        ) : (
          <>
            <Link to="/login" className={styles.navLink}>Войти</Link>
            <Link to="/register" className={styles.navLink}>Регистрация</Link>
          </>
        )}
      </div>
    </header>
  );
}