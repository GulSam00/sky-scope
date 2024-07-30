import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import ReactGA from 'react-ga4';
import { Analytics } from '@vercel/analytics/react';

import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

ReactGA.initialize(import.meta.env.VITE_GA_TRACKING_ID);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />

    <Analytics />
  </React.StrictMode>,
);
