import React, { memo, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'shared/ui/Button';
import styles from './Pagination.module.css';

interface PaginationProps {
  total: number;
  limit: number;
  skip: number;
  onPageChange: (skip: number) => void;
}

export const Pagination = memo<PaginationProps>(function Pagination({
  total,
  limit,
  skip,
  onPageChange,
}) {
  const { t } = useTranslation();

  const totalPages = useMemo(
    () => Math.ceil(total / limit),
    [total, limit]
  );
  const currentPage = useMemo(
    () => Math.floor(skip / limit) + 1,
    [skip, limit]
  );

  const handlePrev = useCallback(() => {
    onPageChange(Math.max(0, skip - limit));
  }, [skip, limit, onPageChange]);

  const handleNext = useCallback(() => {
    onPageChange(skip + limit);
  }, [skip, limit, onPageChange]);

  if (totalPages <= 1) return null;

  return (
    <div className={styles.wrapper}>
      <Button
        variant="secondary"
        onClick={handlePrev}
        disabled={currentPage <= 1}
      >
        &larr;
      </Button>
      <span className={styles.info}>
        {t('common.page')} {currentPage} / {totalPages}
      </span>
      <Button
        variant="secondary"
        onClick={handleNext}
        disabled={currentPage >= totalPages}
      >
        &rarr;
      </Button>
    </div>
  );
});
