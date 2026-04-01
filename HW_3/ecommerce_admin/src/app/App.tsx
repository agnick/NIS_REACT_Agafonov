import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'app/store/store';
import { AppRouter } from 'app/router/AppRouter';
import { ErrorBoundary } from 'shared/ui/ErrorBoundary';
import { AppInitializer } from './AppInitializer';
import 'shared/lib/i18n/config';
import 'app/styles/global.css';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <BrowserRouter>
          <ThemeApplier />
          <AppInitializer />
          <AppRouter />
        </BrowserRouter>
      </ErrorBoundary>
    </Provider>
  );
};

const ThemeApplier: React.FC = () => {
  const theme = store.getState().settings.theme;

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const currentTheme = store.getState().settings.theme;
      document.documentElement.setAttribute('data-theme', currentTheme);
    });
    document.documentElement.setAttribute('data-theme', theme);
    return unsubscribe;
  }, [theme]);

  return null;
};

export default App;
