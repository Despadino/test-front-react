import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import styles from './FullLayout.module.css';

export default function FullLayout() {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}