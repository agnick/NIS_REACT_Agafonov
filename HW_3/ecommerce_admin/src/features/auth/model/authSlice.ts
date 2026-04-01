import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'entities/user/model/types';
import { TOKEN_KEY } from 'shared/config/constants';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem(TOKEN_KEY),
  isAuthenticated: false,
  isInitialized: !localStorage.getItem(TOKEN_KEY),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isInitialized = true;
      localStorage.setItem(TOKEN_KEY, action.payload.token);
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isInitialized = true;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
      localStorage.removeItem(TOKEN_KEY);
    },
    initFailed(state) {
      state.token = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
      localStorage.removeItem(TOKEN_KEY);
    },
  },
});

export const { setCredentials, setUser, logout, initFailed } =
  authSlice.actions;

export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectIsInitialized = (state: { auth: AuthState }) =>
  state.auth.isInitialized;

export default authSlice.reducer;
