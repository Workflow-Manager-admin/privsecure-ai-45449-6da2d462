import React from "react";

/**
 * PUBLIC_INTERFACE
 * About Page for EchoGuard
 * Shows app info, privacy statement, build version and credits.
 */
function About() {
  return (
    <div className="container" style={{
      maxWidth: 600, marginTop: 56, background: "var(--surface)", borderRadius: "var(--border-radius)",
      boxShadow: "var(--box-shadow)", padding: "40px 30px 37px", color: "var(--text-primary)"
    }}>
      <h1 className="title" style={{
        color: "var(--primary)", fontWeight: 900, fontSize: "2.09rem", marginBottom: 10,
        textShadow: "0 0 18px var(--secondary), 0 0 2px var(--primary)", letterSpacing: ".05em"
      }}>
        About EchoGuard
      </h1>
      <div className="subtitle" style={{
        color: "var(--accent)", fontWeight: 600, fontSize: "1.09rem", marginBottom: 11
      }}>
        AI-powered privacy dashboard, risk tracking, and actionable cybersecurity tools.
      </div>

      <p>
        <strong>EchoGuard</strong> is a next-generation privacy and cyber protection platform powered
        by AI. It lets you audit your risk, spot threats, and manage your privacy footprint—all in one place.
        <br /><br />
        Designed for everyday users and privacy champions.
      </p>

      <ul style={{
        marginLeft: 0, paddingLeft: 22, color: "var(--text-secondary)", fontSize: "1.02em"
      }}>
        <li>Real-time digital exposure and breach alert monitoring</li>
        <li>Smart privacy action plan with daily guidance</li>
        <li>Social graph and third-party app risk scanning</li>
        <li>Data disintegration and badge achievement system</li>
      </ul>

      <hr className="divider" />

      <p style={{ opacity: 0.75 }}>
        <strong>Version:</strong> 1.0.0<br />
        <strong>Team:</strong> KAVIA privacy tech<br />
        <strong>GitHub:</strong> <a href="https://github.com/kaviacloud">kaviacloud</a>
      </p>

      <p style={{
        marginTop: 16,
        color: "var(--text-secondary)",
        opacity: 0.9,
        fontSize: "0.97em",
        fontStyle: "italic"
      }}>
        EchoGuard does not store your data without consent. All analysis is performed locally in the browser using AI algorithms.
      </p>

      <p style={{ color: "var(--accent)", fontWeight: 700, marginTop: 25 }}>
        © 2024 KAVIA. All rights reserved.
      </p>
    </div>
  );
}

export default About;
