import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Future: Change './App' to './pages' or specific entry page if App is moved.

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
