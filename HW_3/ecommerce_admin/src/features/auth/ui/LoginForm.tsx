import React, { memo, useState, useCallback, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLoginMutation } from 'features/auth/api/authApi';
import { setCredentials } from 'features/auth/model/authSlice';
import { useAppDispatch } from 'app/store/hooks';
import { Input } from 'shared/ui/Input';
import { Button } from 'shared/ui/Button';
import styles from './LoginForm.module.css';

export const LoginForm = memo(function LoginForm() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [apiError, setApiError] = useState('');

  const validate = useCallback((): boolean => {
    const newErrors: { username?: string; password?: string } = {};
    if (!username.trim()) newErrors.username = t('auth.usernameRequired');
    if (!password.trim()) newErrors.password = t('auth.passwordRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [username, password, t]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setApiError('');
      if (!validate()) return;

      try {
        const result = await login({ username, password }).unwrap();
        dispatch(
          setCredentials({
            user: {
              id: result.id,
              username: result.username,
              email: result.email,
              firstName: result.firstName,
              lastName: result.lastName,
              image: result.image,
            },
            token: result.accessToken,
          })
        );
        navigate('/', { replace: true });
      } catch {
        setApiError(t('auth.loginError'));
      }
    },
    [username, password, validate, login, dispatch, navigate, t]
  );

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h1 className={styles.title}>{t('auth.login')}</h1>
      <p className={styles.hint}>{t('auth.loginHint')}</p>

      <Input
        id="username"
        label={t('auth.username')}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        error={errors.username}
        autoComplete="username"
      />

      <Input
        id="password"
        type="password"
        label={t('auth.password')}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        autoComplete="current-password"
      />

      {apiError && <p className={styles.apiError}>{apiError}</p>}

      <Button type="submit" fullWidth disabled={isLoading}>
        {isLoading ? t('common.loading') : t('auth.signIn')}
      </Button>
    </form>
  );
});
