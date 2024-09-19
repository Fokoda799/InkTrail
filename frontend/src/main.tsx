import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { positions, Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';

import App from './App';
import store, { persistor } from './redux/store'; // Group store imports

// MUI theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff', // Use the built-in background.paper
    },
  },
});

// Alert options for react-alert
const alertOptions = {
  timeout: 10000,
  position: positions.TOP_RIGHT,
};

// Root rendering using React 18 API
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <AlertProvider template={AlertTemplate} {...alertOptions}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </AlertProvider>
    </PersistGate>
  </Provider>
);
