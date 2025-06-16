import React from "react";

// PUBLIC_INTERFACE
// Minimal stub Login page for authentication flow entry.
function Login({ onLogin }) {
  return (
    <div style={{ maxWidth: 400, margin: "100px auto", textAlign: "center" }}>
      <h1>Login</h1>
      <p>This is a placeholder Login page.<br />Implement authentication here in a real app.</p>
      <button className="btn" onClick={onLogin} style={{ marginTop: 24 }}>
        Simulate Login
      </button>
    </div>
  );
}

export default Login;
