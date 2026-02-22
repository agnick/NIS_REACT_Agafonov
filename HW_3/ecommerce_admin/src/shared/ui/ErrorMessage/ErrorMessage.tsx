import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'shared/ui/Button';
import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorMessage = memo<ErrorMessageProps>(function ErrorMessage({
  message,
  onRetry,
}) {
  const { t } = useTranslation();

  return (
    <div className={styles.wrapper}>
      <p className={styles.text}>{message ?? t('common.error')}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          {t('common.retry')}
        </Button>
      )}
    </div>
  );
});
