import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from 'app/store/hooks';
import { selectUser } from 'features/auth/model/authSlice';
import { Button } from 'shared/ui/Button';
import styles from './ProfilePage.module.css';

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{t('profile.title')}</h1>

      {user && (
        <div className={styles.card}>
          <img src={user.image} alt={user.firstName} className={styles.avatar} />
          <div className={styles.info}>
            <div className={styles.field}>
              <span className={styles.label}>{t('profile.name')}</span>
              <span className={styles.value}>
                {user.firstName} {user.lastName}
              </span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>{t('profile.email')}</span>
              <span className={styles.value}>{user.email}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>{t('profile.username')}</span>
              <span className={styles.value}>{user.username}</span>
            </div>
          </div>
          <Button variant="danger" onClick={() => navigate('/logout')}>
            {t('profile.logoutButton')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
