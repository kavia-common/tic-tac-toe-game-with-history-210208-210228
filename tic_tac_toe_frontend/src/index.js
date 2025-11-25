import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Temporary logging to confirm env embedding and runtime config at app start
try {
  // eslint-disable-next-line no-console
  console.log('[TicTacToe][Startup] process.env.REACT_APP_API_BASE:', (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) || '(undefined)');
  // eslint-disable-next-line no-console
  console.log('[TicTacToe][Startup] window.__APP_CONFIG__?.REACT_APP_API_BASE:', (typeof window !== 'undefined' && window.__APP_CONFIG__ && window.__APP_CONFIG__.REACT_APP_API_BASE) || '(undefined)');
} catch (e) {
  // eslint-disable-next-line no-console
  console.warn('[TicTacToe][Startup] Failed to print startup config:', e && e.message);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
