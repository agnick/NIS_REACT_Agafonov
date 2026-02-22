import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from 'shared/api/baseApi';
import authReducer from 'features/auth/model/authSlice';
import settingsReducer from 'features/settings/model/settingsSlice';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
