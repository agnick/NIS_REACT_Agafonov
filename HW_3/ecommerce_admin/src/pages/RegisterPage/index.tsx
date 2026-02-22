import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './RegisterPage.module.css';

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>{t('auth.register')}</h1>
        <p className={styles.message}>{t('auth.registerStub')}</p>
        <p className={styles.link}>
          {t('auth.haveAccount')}{' '}
          <Link to="/login">{t('auth.login')}</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
