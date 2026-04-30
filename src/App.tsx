import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import RequireAuth from './components/RequireAuth';
import DefaultLayout from './components/Layout/DefaultLayout';
import FullLayout from './components/Layout/FullLayout';
import Store from './pages/Store';
import Friends from './pages/Friends';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Публичные маршруты (без авторизации) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Все защищённые маршруты (требуют авторизации) */}
      <Route element={<RequireAuth />}>
        {/* Маршруты с боковым меню (Sidebar) */}
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Navigate to="/store" replace />} />
          <Route path="/store" element={<Store />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>

        {/* Маршруты без бокового меню (только верхняя панель) */}
        <Route element={<FullLayout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;