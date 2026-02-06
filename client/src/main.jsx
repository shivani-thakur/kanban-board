import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

/**
 * Application Entry Point
 * Bootstraps the React application and renders it to the DOM.
 */

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
