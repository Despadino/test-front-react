import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <div className={styles.avatar}>🌙</div>
        <h2>{user?.username || 'Пользователь'}</h2>
        <p className={styles.username}>Логин: {user?.username}</p>
        <button className={styles.button} onClick={handleLogout}>
          Выйти
        </button>
      </div>
    </div>
  );
}