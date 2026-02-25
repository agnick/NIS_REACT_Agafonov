import React, { memo } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from 'widgets/Sidebar/Sidebar';
import { Header } from 'widgets/Header/Header';
import styles from './Layout.module.css';

export const Layout = memo(function Layout() {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.main}>
        <Header />
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
});
