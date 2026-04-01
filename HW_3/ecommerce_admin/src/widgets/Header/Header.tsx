import React, { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { selectUser } from 'features/auth/model/authSlice';
import {
  selectLanguage,
  selectTheme,
  setLanguage,
  setTheme,
} from 'features/settings/model/settingsSlice';
import styles from './Header.module.css';

export const Header = memo(function Header() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const language = useAppSelector(selectLanguage);
  const theme = useAppSelector(selectTheme);

  const toggleTheme = useCallback(() => {
    dispatch(setTheme(theme === 'light' ? 'dark' : 'light'));
  }, [theme, dispatch]);

  const toggleLanguage = useCallback(() => {
    dispatch(setLanguage(language === 'en' ? 'ru' : 'en'));
  }, [language, dispatch]);

  return (
    <header className={styles.header}>
      <div className={styles.spacer} />
      <div className={styles.actions}>
        <button
          className={styles.toggleBtn}
          onClick={toggleLanguage}
          title={t('settings.language')}
        >
          {language === 'en' ? 'RU' : 'EN'}
        </button>
        <button
          className={styles.toggleBtn}
          onClick={toggleTheme}
          title={t('settings.theme')}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        {user && (
          <div className={styles.user}>
            <img
              src={user.image}
              alt={user.firstName}
              className={styles.avatar}
            />
            <span className={styles.name}>
              {user.firstName} {user.lastName}
            </span>
          </div>
        )}
      </div>
    </header>
  );
});
