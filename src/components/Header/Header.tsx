// src/components/Header/Header.tsx
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AUTH_HEADER_LINKS, GUEST_HEADER_LINKS, ROUTES } from '../../constants';
import styles from './Header.module.css';

export default function Header() {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  const isAppsActive = () => {
    const path = location.pathname;
    return path === ROUTES.STORE || path === ROUTES.DEV;
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>✦ Nebula</div>
      <div className={styles.right}>
        {isAuthenticated ? (
          <>
            <span className={styles.userEmail}>{user?.username}</span>
            <span className={styles.balance}>💰 {user?.balance ?? 0}</span>
            {AUTH_HEADER_LINKS.map(link => {
              let isActive = false;
              if (link.to === ROUTES.STORE) {
                isActive = isAppsActive();
              } else {
                isActive = location.pathname === link.to;
              }
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                >
                  {link.label}
                </NavLink>
              );
            })}
          </>
        ) : (
          GUEST_HEADER_LINKS.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))
        )}
      </div>
    </header>
  );
}