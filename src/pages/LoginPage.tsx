// src/pages/LoginPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthForm } from '../components/AuthForm/AuthForm';
import { ROUTES } from '../constants';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (username: string, password: string) => {
    setLoading(true);
    const success = await login(username, password);
    setLoading(false);
    if (success) {
      navigate(ROUTES.STORE);
    } else {
      setError('Пользователь не найден. Зарегистрируйтесь.');
    }
  };

  return (
    <AuthForm
      title="Вход в систему"
      buttonText={loading ? 'Вход...' : 'Войти'}
      footerText="Нет аккаунта?"
      footerLinkText="Зарегистрироваться"
      footerLinkTo={ROUTES.REGISTER}
      onSubmit={handleSubmit}
      error={error}
    />
  );
}