import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// App now handles all routing; root render remains unchanged.

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
