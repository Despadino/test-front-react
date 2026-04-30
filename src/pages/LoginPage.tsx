import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      navigate('/store');
    } else {
      setError('Пользователь не найден. Зарегистрируйтесь.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Вход в систему</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Логин"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.button}>Войти</button>
        </form>
        <p className={styles.hint}>
          Нет аккаунта? <Link to="/register" className={styles.link}>Зарегистрироваться</Link>
        </p>
        <p className={styles.demoHint}>Любой логин и пароль (не пустые)</p>
      </div>
    </div>
  );
}