import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LoginForm } from 'features/auth/ui/LoginForm';
import styles from './LoginPage.module.css';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <LoginForm />
      <p className={styles.link}>
        {t('auth.noAccount')}{' '}
        <Link to="/register">{t('auth.register')}</Link>
      </p>
    </div>
  );
};

export default LoginPage;
