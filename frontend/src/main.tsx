import ReactDOM from 'react-dom/client';
//import AppRouter from './router';
import App from "./App";
import '@fortawesome/fontawesome-free/css/all.min.css';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import AppProviders from './providers/AppProvider';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <BrowserRouter>
    <AppProviders>
      <App />
    </AppProviders>
  </BrowserRouter>
);