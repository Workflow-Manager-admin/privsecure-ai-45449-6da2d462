import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * Login page for EchoGuard
 * Hero login, styled as cyber/privacy, demo only.
 */
function Login({ onLogin }) {
  const [loading, setLoading] = useState(false);

  function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin && onLogin();
    }, 900);
  }

  return (
    <div className="container" style={{
      marginTop: 0, maxWidth: 460, padding: 0, display: "flex", minHeight: "92vh", alignItems: "center"
    }}>
      <main className="page-main-surface" style={{
        background: "var(--surface)", borderRadius: "var(--border-radius)", padding: "44px 28px 38px 28px",
        boxShadow: "var(--box-shadow)", minHeight: 330, maxWidth: 430, margin: "0 auto", marginTop: 50, color: "var(--text-primary)"
      }}>
        <div className="hero" style={{
          paddingTop: 26, paddingBottom: 24, textAlign: "center", gap: 0, marginBottom: 12, marginTop: -17
        }}>
          <span className="logo" style={{
            color: "var(--primary)", fontWeight: 800, fontFamily: "'Montserrat', 'Poppins', Arial, sans-serif", letterSpacing: ".07em",
            fontSize: "2.09rem", textShadow: "0 0 11px var(--secondary)", marginBottom: 13, display: "inline-flex", alignItems: "center"
          }}>
            <span className="logo-symbol" style={{ color: "var(--accent)", marginRight: 9, fontSize: "2.31rem" }}>⎓</span>
            EchoGuard
          </span>
          <div className="subtitle" style={{
            fontSize: "1.13rem", color: "var(--secondary)", fontWeight: 600, letterSpacing: ".09em", paddingTop: 2
          }}>
            AI-powered Digital Privacy & Cybersecurity
          </div>
        </div>

        <form onSubmit={handleLogin} autoComplete="off" style={{ marginTop: 10 }}>
          <input
            type="email"
            placeholder="Email address"
            required
            style={{ width: "100%", marginBottom: 17 }}
          />
          <input
            type="password"
            placeholder="Password"
            required
            style={{ width: "100%" }}
          />
          <button
            type="submit"
            className="btn btn-large"
            style={{ marginTop: 17, marginBottom: 6, width: "100%" }}
            disabled={loading}
            aria-disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
        <div style={{ marginTop: 18, textAlign: "center", color: "var(--text-secondary)", fontSize: ".99em" }}>
          <span>Demo Only – No account needed.</span>
        </div>
        <div style={{ marginTop: 11, textAlign: "center", color: "var(--accent)", fontWeight: 600, fontSize: "1.05em", opacity: 0.88 }}>
          &copy; 2024 EchoGuard
        </div>
      </main>
    </div>
  );
}

export default Login;
