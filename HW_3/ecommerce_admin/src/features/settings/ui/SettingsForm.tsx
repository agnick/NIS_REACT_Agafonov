import React, { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import {
  selectLanguage,
  selectTheme,
  selectPageSize,
  setLanguage,
  setTheme,
  setPageSize,
} from 'features/settings/model/settingsSlice';
import styles from './SettingsForm.module.css';

const PAGE_SIZE_OPTIONS = [6, 9, 12, 18, 24];

export const SettingsForm = memo(function SettingsForm() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const language = useAppSelector(selectLanguage);
  const theme = useAppSelector(selectTheme);
  const pageSize = useAppSelector(selectPageSize);

  const handleLanguage = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(setLanguage(e.target.value as 'en' | 'ru'));
    },
    [dispatch]
  );

  const handleTheme = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(setTheme(e.target.value as 'light' | 'dark'));
    },
    [dispatch]
  );

  const handlePageSize = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(setPageSize(Number(e.target.value)));
    },
    [dispatch]
  );

  return (
    <div className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="language">
          {t('settings.language')}
        </label>
        <select
          id="language"
          className={styles.select}
          value={language}
          onChange={handleLanguage}
        >
          <option value="en">{t('settings.english')}</option>
          <option value="ru">{t('settings.russian')}</option>
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="theme">
          {t('settings.theme')}
        </label>
        <select
          id="theme"
          className={styles.select}
          value={theme}
          onChange={handleTheme}
        >
          <option value="light">{t('settings.light')}</option>
          <option value="dark">{t('settings.dark')}</option>
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="pageSize">
          {t('settings.pageSize')}
        </label>
        <select
          id="pageSize"
          className={styles.select}
          value={pageSize}
          onChange={handlePageSize}
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
});
