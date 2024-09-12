import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Import any global styles here

// Create a root element for React to render into
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// Render the App component into the root element
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
