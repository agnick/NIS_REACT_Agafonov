import React from 'react';
import { useTranslation } from 'react-i18next';
import { SettingsForm } from 'features/settings/ui/SettingsForm';
import styles from './SettingsPage.module.css';

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{t('settings.title')}</h1>
      <SettingsForm />
    </div>
  );
};

export default SettingsPage;
