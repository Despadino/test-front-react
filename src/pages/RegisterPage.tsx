// src/pages/RegisterPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthForm } from '../components/AuthForm/AuthForm';
import { ROUTES } from '../constants';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (username: string, password: string) => {
    setLoading(true);
    const success = await register(username, password);
    setLoading(false);
    if (success) {
      navigate(ROUTES.STORE);
    } else {
      setError('Пользователь с таким логином уже существует');
    }
  };

  return (
    <AuthForm
      title="Регистрация"
      buttonText={loading ? 'Регистрация...' : 'Зарегистрироваться'}
      footerText="Уже есть аккаунт?"
      footerLinkText="Войти"
      footerLinkTo={ROUTES.LOGIN}
      onSubmit={handleSubmit}
      error={error}
      showConfirmPassword
    />
  );
}