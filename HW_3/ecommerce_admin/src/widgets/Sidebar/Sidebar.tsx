import React, { memo } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { path: '/', labelKey: 'nav.dashboard' },
  { path: '/products', labelKey: 'nav.products' },
  { path: '/profile', labelKey: 'nav.profile' },
  { path: '/settings', labelKey: 'nav.settings' },
  { path: '/logout', labelKey: 'nav.logout' },
] as const;

export const Sidebar = memo(function Sidebar() {
  const { t } = useTranslation();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>Admin Panel</div>
      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ path, labelKey }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ''}`
            }
          >
            {t(labelKey)}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
});
