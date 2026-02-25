import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from 'app/store/hooks';
import { selectUser } from 'features/auth/model/authSlice';
import { useGetProductsQuery } from 'features/products/api/productsApi';
import styles from './DashboardPage.module.css';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const user = useAppSelector(selectUser);
  const { data } = useGetProductsQuery({ limit: 1, skip: 0 });

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{t('dashboard.title')}</h1>
      <p className={styles.welcome}>
        {t('dashboard.welcome', { name: user?.firstName ?? '' })}
      </p>

      <div className={styles.cards}>
        <div className={styles.card}>
          <span className={styles.cardLabel}>{t('dashboard.totalProducts')}</span>
          <span className={styles.cardValue}>{data?.total ?? '—'}</span>
        </div>
        <div className={styles.card}>
          <span className={styles.cardLabel}>{t('dashboard.yourEmail')}</span>
          <span className={styles.cardValue}>{user?.email ?? '—'}</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
