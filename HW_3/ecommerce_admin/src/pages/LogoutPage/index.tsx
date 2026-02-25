import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppDispatch } from 'app/store/hooks';
import { logout } from 'features/auth/model/authSlice';
import { baseApi } from 'shared/api/baseApi';

const LogoutPage: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(logout());
    dispatch(baseApi.util.resetApiState());
  }, [dispatch]);

  return <Navigate to="/login" replace />;
};

export default LogoutPage;
