import React, { useState } from "react";
import "../App.css";

/**
 * PUBLIC_INTERFACE
 * Login: Cyber/dark themed login page for PrivSecure AI, supporting OAuth (placeholder) and email/password login.
 * Props:
 *   - onLogin: function to call on simulated login (passed in from App)
 */
function Login({ onLogin }) {
  // Simple local state for controlled email/password inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Placeholder for showing 'error'
  const [error, setError] = useState("");

  // Placeholder submit handler for email/password
  const handleEmailLogin = (e) => {
    e.preventDefault();
    setError("");
    // Fake validation: error if empty, success otherwise
    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }
    // In a real app: API call here
    onLogin && onLogin();
  };

  // Placeholder OAuth click (simulate OAuth login)
  const handleOAuthLogin = (provider) => {
    // Could show a short toast/modal, but just simulate login
    onLogin && onLogin();
  };

  return (
    <div
      className="container"
      style={{
        marginTop: "120px",
        maxWidth: 420,
        background: "var(--surface)",
        borderRadius: "var(--border-radius)",
        boxShadow: "var(--box-shadow)",
        padding: "36px 30px 34px",
        color: "var(--text-primary)",
        backdropFilter: "blur(6px)",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <span
          className="logo-symbol"
          style={{ fontSize: "2.3rem", color: "var(--accent)", textShadow: "0 0 30px var(--primary)" }}
        >
          ⎓
        </span>
        <div className="title" style={{ fontSize: "2.07rem", marginTop: 7, marginBottom: 0 }}>Sign in to PrivSecure AI</div>
        <div className="subtitle" style={{ fontSize: "1rem", marginTop: 4, color: "var(--accent)" }}>
          Cybersecurity, powered by privacy & AI.
        </div>
      </div>

      {/* OAuth Buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
        <button
          className="btn btn-large pulse-cyber"
          style={{
            background: "linear-gradient(90deg, #2326ffcc, #e725fc)",
            color: "#fff",
            fontWeight: 700,
            letterSpacing: "0.02em",
            marginBottom: 1,
            boxShadow: "0 0 12px 1px #0ff5, 0 0 22px 1px #f0f3",
          }}
          onClick={() => handleOAuthLogin('google')}
          type="button"
        >
          {/* Placeholder 'icon' for Google */}
          <span
            style={{
              marginRight: 12,
              verticalAlign: "middle",
              fontSize: "1.05em",
              filter: "drop-shadow(0 0 4px #fff8)",
            }}
          >🟢</span>
          Login with Google
        </button>

        {/* Placeholder for future extra providers (shown faded-out) */}
        <button
          className="btn btn-large"
          style={{
            background: "linear-gradient(90deg, #31354a 40%, #23232b 100%)",
            color: "var(--text-secondary)",
            opacity: 0.45,
            cursor: "not-allowed",
            marginTop: 2,
          }}
          disabled
          type="button"
        >
          {/* Placeholder MS/Apple (grayed) */}
          <span style={{ marginRight: 12, fontSize: "1.05em" }}>⚪️</span>
          Login with Microsoft (coming soon)
        </button>
      </div>

      <div
        className="divider"
        style={{ margin: "22px 0", borderTop: "1px solid var(--border-color)", position: "relative" }}
      >
        <span
          style={{
            position: "absolute",
            top: "-17px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--surface)",
            color: "var(--text-secondary)",
            padding: "0 14px",
            fontSize: "0.98em",
            letterSpacing: "0.02em",
          }}
        >
          or
        </span>
      </div>

      {/* Email/password form */}
      <form autoComplete="off" onSubmit={handleEmailLogin} style={{ marginBottom: 8 }}>
        <div style={{ marginBottom: 13 }}>
          <input
            type="email"
            placeholder="Email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", marginBottom: 8 }}
            spellCheck={false}
            required
            aria-label="Email"
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%" }}
            required
            aria-label="Password"
          />
        </div>
        {error && (
          <div style={{ color: "#f45", marginBottom: 10, textShadow: "0 0 8px #f0f7", fontSize: "1.03em" }}>
            {error}
          </div>
        )}
        <button
          className="btn btn-large"
          type="submit"
          style={{
            width: "100%",
            marginTop: "2px",
            boxShadow: "0 0 12px 2px var(--primary)",
            fontWeight: 800,
            letterSpacing: "0.04em",
          }}
        >
          Sign in with Email
        </button>
      </form>
      <div style={{ fontSize: "0.99em", textAlign: "center", marginTop: 18, color: "var(--text-secondary)" }}>
        Forgot password? <span style={{ color: "var(--primary)", cursor: "not-allowed", opacity: 0.6 }}>Recover (soon)</span>
      </div>
    </div>
  );
}

export default Login;
