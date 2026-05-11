// src/App.tsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import RequireAuth from './components/RequireAuth';
import DefaultLayout from './components/Layout/DefaultLayout';
import FullLayout from './components/Layout/FullLayout';
import { ROUTES } from './constants';

const Store = lazy(() => import('./pages/applications/Store/Store'));
const StoreProductPage = lazy(() => import('./pages/applications/StoreProductPage/StoreProductPage'));
const DevPage = lazy(() => import('./pages/applications/Dev/DevPage'));
const Friends = lazy(() => import('./pages/friends/Friends'));
const Settings = lazy(() => import('./pages/settings/Settings'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const AppPage = lazy(() => import('./pages/applications/AppPage/AppPage'));

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Suspense fallback={<div className="loading">Загрузка...</div>}>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route element={<RequireAuth />}>
          <Route element={<DefaultLayout />}>
            <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.STORE} replace />} />
            <Route path={ROUTES.STORE} element={<Store />} />
            <Route path="/store/product/:productId" element={<StoreProductPage />} />
            <Route path={ROUTES.DEV} element={<DevPage />} />
            <Route path={ROUTES.APP} element={<AppPage />} />
          </Route>
          <Route element={<FullLayout />}>
            <Route path={ROUTES.FRIENDS} element={<Friends />} />
            <Route path={ROUTES.SETTINGS} element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;