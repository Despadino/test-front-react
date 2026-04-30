import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import styles from './DefaultLayout.module.css';

export default function DefaultLayout() {
  return (
    <div className={styles.container}>
      <Sidebar />
      <Header />
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}