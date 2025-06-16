import React, { useState } from "react";

/*
  DarkWebLeaks: Displays leak alerts as cards, each showing breach name, impact, and mitigation.
  Provides a toggle to show only "new" or "critical" alerts.
  The UI is styled to match the app's theme, clean and responsive.
*/

// PUBLIC_INTERFACE
function DarkWebLeaks() {
  // Mock data for leak alerts
  const mockLeaks = [
    {
      id: 1,
      name: "Acme Services Data Breach",
      impact: "Email, password and address exposed on hacker forum.",
      mitigation: [
        "Change your Acme account password",
        "Enable two-factor authentication",
        "Monitor account for suspicious login attempts"
      ],
      isNew: true,
      isCritical: true,
      detectedAt: "2024-06-12",
      severity: "critical"
    },
    {
      id: 2,
      name: "Retail CRM Leak",
      impact: "Contact info (phone, address) listed in public breach aggregator.",
      mitigation: [
        "Review recent scam calls/messages",
        "Consider updating contact info",
        "Check with company for further security updates"
      ],
      isNew: false,
      isCritical: false,
      detectedAt: "2024-05-21",
      severity: "moderate"
    },
    {
      id: 3,
      name: "Old SocialNet Compromise",
      impact: "Username and hashed password released in old archive.",
      mitigation: [
        "If account reused elsewhere, reset those passwords",
        "Do not reuse passwords across multiple sites"
      ],
      isNew: true,
      isCritical: false,
      detectedAt: "2024-06-10",
      severity: "low"
    },
    {
      id: 4,
      name: "FinTech App Breach",
      impact: "Banking info and transaction history listed for sale on dark web market.",
      mitigation: [
        "Immediately contact your bank for a security review",
        "Monitor statements for fraudulent transactions",
        "Place freeze or alerts on affected accounts"
      ],
      isNew: false,
      isCritical: true,
      detectedAt: "2024-05-31",
      severity: "critical"
    }
  ];

  const [showCriticalOnly, setShowCriticalOnly] = useState(false);

  // Filter leaks based on toggle
  const filteredLeaks = showCriticalOnly
    ? mockLeaks.filter(l => l.isNew || l.isCritical)
    : mockLeaks;

  return (
    <div className="container" style={{ minHeight: "80vh" }}>
      <h1 className="page-title" style={{ marginBottom: "10px" }}>
        Dark Web Leak Monitor
      </h1>
      <p className="description" style={{ marginBottom: 22 }}>
        Get real-time visibility into your data exposures on the dark web.
        Review alert cards for new or high-risk breaches, and follow these
        recommended mitigation steps.
      </p>

      {/* Toggle for critical/new only */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 22,
          marginTop: 2,
          userSelect: "none"
        }}
      >
        <label
          htmlFor="leak-critical-toggle"
          style={{
            fontWeight: 600,
            color: "var(--text-primary)",
            fontSize: "1.1rem",
            cursor: "pointer"
          }}
        >
          Show only <span style={{ color: "var(--primary)" }}>new</span> / <span style={{ color: "var(--primary)" }}>critical</span> alerts
        </label>
        <ToggleSwitch
          id="leak-critical-toggle"
          checked={showCriticalOnly}
          onChange={() => setShowCriticalOnly(v => !v)}
        />
      </div>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "22px"
        }}
      >
        {filteredLeaks.length === 0 && (
          <div
            className="card"
            style={{
              textAlign: "center",
              color: "var(--text-secondary)",
              minHeight: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            No alerts match this filter – you're all clear!
          </div>
        )}

        {filteredLeaks.map(leak => (
          <LeakCard key={leak.id} leak={leak} />
        ))}
      </section>
    </div>
  );
}

/**
 * LeakCard component displays breach info in a clean, prominent card.
 */
function LeakCard({ leak }) {
  // Card accent for critical/new
  const accent =
    leak.severity === "critical"
      ? "var(--primary)"
      : leak.isNew
      ? "var(--secondary)"
      : "var(--border-color)";
  const glow =
    leak.severity === "critical"
      ? "0 0 16px 2px var(--primary)"
      : leak.isNew
      ? "0 0 8px 1px var(--secondary)"
      : "none";

  return (
    <div
      className="card"
      style={{
        boxShadow: `var(--box-shadow), ${glow}`,
        borderColor: accent,
        borderWidth: "2px",
        borderStyle: "solid",
        minHeight: 180,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background:
          leak.severity === "critical"
            ? "linear-gradient(96deg, #fff7f4 90%, #F6CBCA 100%)"
            : leak.isNew
            ? "linear-gradient(95deg, #f6fdff 97%, #c7fafd 100%)"
            : undefined
      }}
    >
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <h2
            className="subtitle"
            style={{
              margin: 0,
              fontSize: "1.19rem",
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: "0.01em"
            }}
          >
            {leak.name}
          </h2>
          {/* Status chips */}
          {leak.isNew && (
            <span
              style={{
                background: "var(--secondary)",
                color: "#fff",
                borderRadius: 8,
                fontSize: ".94em",
                padding: "2px 11px",
                marginLeft: 7,
                fontWeight: 600
              }}
            >
              NEW
            </span>
          )}
          {leak.severity === "critical" && (
            <span
              style={{
                background: "var(--primary)",
                color: "#fff",
                borderRadius: 8,
                fontSize: ".94em",
                padding: "2px 11px",
                marginLeft: 7,
                fontWeight: 600
              }}
            >
              CRITICAL
            </span>
          )}
        </div>
        <div style={{ fontWeight: 500, marginBottom: 10 }}>
          <span style={{ color: "var(--text-secondary)" }}>
            {leak.impact}
          </span>
        </div>
        <ul style={{ margin: 0, paddingLeft: "1.3em" }}>
          {leak.mitigation.map((step, i) => (
            <li
              key={i}
              style={{
                color: "var(--text-primary)",
                fontSize: "1.06rem",
                marginBottom: 4
              }}
            >
              {step}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ textAlign: "right", marginTop: 12 }}>
        <span
          style={{
            fontSize: ".92em",
            color: "var(--text-secondary)",
            fontWeight: 500
          }}
        >
          Alerted: {leak.detectedAt}
        </span>
      </div>
    </div>
  );
}

/**
 * ToggleSwitch: Theme-consistent, accessible toggle switch.
 */
function ToggleSwitch({ id, checked, onChange }) {
  return (
    <span style={{ display: "inline-block", position: "relative" }}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        style={{
          opacity: 0,
          width: 40,
          height: 24,
          margin: 0,
          position: "absolute",
          left: 0,
          top: 0,
          zIndex: 2,
          cursor: "pointer"
        }}
        aria-checked={checked}
        tabIndex={0}
      />
      <span
        aria-hidden="true"
        style={{
          display: "inline-block",
          width: 40,
          height: 24,
          background: checked
            ? "linear-gradient(90deg, var(--primary), var(--secondary) 85%)"
            : "var(--border-color)",
          borderRadius: 14,
          position: "relative",
          verticalAlign: "middle",
          transition: "background .18s",
          boxShadow: checked
            ? "0 0 6px 1px var(--primary)"
            : "0 0 3px 0 var(--border-color)"
        }}
      >
        <span
          style={{
            display: "block",
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "#fff",
            position: "absolute",
            left: checked ? 20 : 4,
            top: 3,
            transition: "left .19s cubic-bezier(0.4,0,0.2,1)",
            boxShadow:
              checked
                ? "0 0 8px 2px var(--primary), 0 1px 6px 1px var(--secondary)"
                : "0 0 2px 1px var(--border-color)"
          }}
        />
      </span>
    </span>
  );
}

export default DarkWebLeaks;
