import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from 'app/store/hooks';
import { selectIsAuthenticated, selectIsInitialized } from 'features/auth/model/authSlice';
import { Loader } from 'shared/ui/Loader';

export const PublicRoute: React.FC = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isInitialized = useAppSelector(selectIsInitialized);

  if (!isInitialized) return <Loader />;
  if (isAuthenticated) return <Navigate to="/" replace />;

  return <Outlet />;
};
