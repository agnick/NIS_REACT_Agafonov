import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import i18n from 'shared/lib/i18n/config';
import { SETTINGS_KEY, DEFAULT_PAGE_SIZE } from 'shared/config/constants';

type Language = 'en' | 'ru';
type Theme = 'light' | 'dark';

interface SettingsState {
  language: Language;
  theme: Theme;
  pageSize: number;
}

function loadSettings(): SettingsState {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        language: parsed.language ?? 'en',
        theme: parsed.theme ?? 'light',
        pageSize: parsed.pageSize ?? DEFAULT_PAGE_SIZE,
      };
    }
  } catch {
    // ignore
  }
  return { language: 'en', theme: 'light', pageSize: DEFAULT_PAGE_SIZE };
}

function persistSettings(state: SettingsState): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(state));
}

const initialState: SettingsState = loadSettings();

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<Language>) {
      state.language = action.payload;
      i18n.changeLanguage(action.payload);
      persistSettings(state);
    },
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
      persistSettings(state);
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
      persistSettings(state);
    },
  },
});

export const { setLanguage, setTheme, setPageSize } = settingsSlice.actions;

export const selectLanguage = (state: { settings: SettingsState }) =>
  state.settings.language;
export const selectTheme = (state: { settings: SettingsState }) =>
  state.settings.theme;
export const selectPageSize = (state: { settings: SettingsState }) =>
  state.settings.pageSize;

export default settingsSlice.reducer;
