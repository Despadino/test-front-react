// src/components/AuthForm/AuthForm.tsx
import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card/Card';
import { Input } from '../ui/Input/Input';
import { Button } from '../ui/Button/Button';
import styles from './AuthForm.module.css';

interface AuthFormProps {
  title: string;
  buttonText: string;
  footerText: string;
  footerLinkText: string;
  footerLinkTo: string;
  onSubmit: (username: string, password: string) => void;
  error?: string;
  showConfirmPassword?: boolean;
}

export const AuthForm = ({
  title,
  buttonText,
  footerText,
  footerLinkText,
  footerLinkTo,
  onSubmit,
  error,
  showConfirmPassword = false,
}: AuthFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (showConfirmPassword && password !== confirm) {
      setLocalError('Пароли не совпадают');
      return;
    }
    setLocalError('');
    onSubmit(username, password);
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <h2 className={styles.title}>{title}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            type="text"
            placeholder="Логин"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {showConfirmPassword && (
            <Input
              type="password"
              placeholder="Подтвердите пароль"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          )}
          {(error || localError) && <p className={styles.error}>{error || localError}</p>}
          <Button type="submit" className={styles.button}>
            {buttonText}
          </Button>
        </form>
        <p className={styles.footer}>
          {footerText} <Link to={footerLinkTo} className={styles.link}>{footerLinkText}</Link>
        </p>
        {!showConfirmPassword && (
          <p className={styles.demoHint}>Любой логин и пароль (не пустые)</p>
        )}
      </Card>
    </div>
  );
};