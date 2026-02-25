import React, { memo } from 'react';
import styles from './Loader.module.css';

export const Loader = memo(function Loader() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.spinner} />
    </div>
  );
});
