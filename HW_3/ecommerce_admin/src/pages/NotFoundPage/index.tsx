import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from 'shared/ui/Button';
import styles from './NotFoundPage.module.css';

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <h1 className={styles.code}>404</h1>
      <h2 className={styles.title}>{t('common.notFound')}</h2>
      <p className={styles.message}>{t('common.notFoundMessage')}</p>
      <Link to="/">
        <Button>{t('common.goHome')}</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
