import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import styles from './RegisterPage.module.css';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError('Пароли не совпадают');
      return;
    }
    const success = register(username, password);
    if (success) {
      navigate('/store');
    } else {
      setError('Пользователь с таким логином уже существует');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Регистрация</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Логин"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Подтвердите пароль"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={styles.input}
            required
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.button}>Зарегистрироваться</button>
        </form>
        <p className={styles.hint}>
          Уже есть аккаунт? <Link to="/login" className={styles.link}>Войти</Link>
        </p>
      </div>
    </div>
  );
}