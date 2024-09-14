import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Import the App component
import './index.css'; // Import any global styles here
import store, { persistor } from './redux/store'; // Import the store
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const alertOptions = {
  timeout: 10000,
  position: positions.TOP_RIGHT
};

root.render(
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
      <AlertProvider template={AlertTemplate} {...alertOptions}>
        <App />
      </AlertProvider>
    </PersistGate>
  </Provider>
);
