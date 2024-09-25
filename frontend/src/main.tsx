import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { positions, Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import store, { persistor } from './redux/store';
//import AppRouter from './router';
import App from "./App";
import CircularProgress from '@mui/material/CircularProgress';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

const alertOptions = {
  timeout: 10000,
  position: positions.TOP_RIGHT,
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <Provider store={store}>
    <PersistGate loading={<CircularProgress />} persistor={persistor}>
      <AlertProvider template={AlertTemplate} {...alertOptions}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AlertProvider>
    </PersistGate>
  </Provider>
);