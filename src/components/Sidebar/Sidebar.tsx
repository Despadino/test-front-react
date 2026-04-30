import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

const menuItems = [
  { name: 'Магазин', path: '/store', emoji: '🛒' },
];

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarInner}>
        <div className={styles.logo}>✦ Nebula</div>
        <nav>
          <ul className={styles.navList}>
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.active : ''}`
                  }
                >
                  <span>{item.emoji}</span>
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}