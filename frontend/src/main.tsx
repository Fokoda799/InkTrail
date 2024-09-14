import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Import the App component
import './index.css'; // Import any global styles here
import store, { persistor } from './redux/store'; // Import the store
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
      <App />
    </PersistGate>
  </Provider>
);
