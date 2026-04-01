import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { selectToken, selectIsInitialized, setUser, initFailed } from 'features/auth/model/authSlice';
import { useLazyGetMeQuery } from 'features/auth/api/authApi';

export const AppInitializer: React.FC = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectToken);
  const isInitialized = useAppSelector(selectIsInitialized);
  const [triggerGetMe] = useLazyGetMeQuery();

  useEffect(() => {
    if (token && !isInitialized) {
      triggerGetMe()
        .unwrap()
        .then((user) => {
          dispatch(setUser(user));
        })
        .catch(() => {
          dispatch(initFailed());
        });
    }
  }, [token, isInitialized, triggerGetMe, dispatch]);

  return null;
};
