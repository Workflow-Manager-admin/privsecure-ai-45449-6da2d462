import React from 'react';
import './App.css';

// Fix for build error: explicitly use process.env.PUBLIC_URL if needed
// (Currently, there is no reference to PUBLIC_URL in this file. 
// If the error is caused by something in index.js or the HTML template, 
// the fix will need to be elsewhere. 
// Added a default safe reference in case of future usage.)

function getPublicUrl() {
  return process.env.PUBLIC_URL || '';
}

function App() {
  // Example usage: <img src={`${getPublicUrl()}/logo.png`} alt="Logo" />
  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol">*</span> KAVIA AI
            </div>
            <button className="btn">Template Button</button>
          </div>
        </div>
      </nav>

      <main>
        <div className="container">
          <div className="hero">
            <div className="subtitle">AI Workflow Manager Template</div>
            
            <h1 className="title">privsecure_ai_frontend</h1>
            
            <div className="description">
              Start building your application.
            </div>
            
            <button className="btn btn-large">Button</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;