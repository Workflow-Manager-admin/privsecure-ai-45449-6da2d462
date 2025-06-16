import React from "react";

/**
 * PUBLIC_INTERFACE
 * DailyPrivacyTipCard: Cyber/dark-themed, responsive widget showing a privacy tip.
 * - Modular, fits in dashboard grid.
 * - Unique themed accent and icon for daily rotation (static mock tip for now).
 */
const tips = [
  {
    title: "Tip: Strengthen Your Passwords",
    content:
      "Avoid using the same password across sites. Use a passphrase with letters, numbers & symbols, or consider a password manager.",
    icon: "🔒"
  },
  {
    title: "Tip: Review App Permissions",
    content:
      "Regularly check which apps have access to your personal data. Disable permissions you no longer trust or need.",
    icon: "👁️"
  },
  {
    title: "Tip: Update Your Devices",
    content:
      "Keep software and operating systems updated to protect against newly discovered vulnerabilities.",
    icon: "🛡️"
  }
];

// Only rotate by day if needed; for demo, show the first tip.
const todayTip = tips[0];

function DailyPrivacyTipCard() {
  return (
    <div
      className="card card-glow"
      style={{
        background: "linear-gradient(113deg, #181a2e 78%, #0d0f1e 100%)",
        border: "1.7px solid var(--primary)",
        boxShadow:
          "0 1px 22px 3px #0ff7, 0 0 17px 2.2px #f0f7 inset, 0 0 8px 1.5px #2323fa18",
        borderRadius: 18,
        minWidth: 210,
        maxWidth: 295,
        flex: "1 1 210px",
        margin: "20px auto",
        color: "var(--text-primary)",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        position: "relative",
        padding: "24px 19px 19px 23px",
        overflow: "hidden",
      }}
      aria-label="Daily Privacy Tip"
    >
      {/* Accent circle behind icon */}
      <div
        style={{
          position: "absolute",
          top: 14,
          right: 16,
          width: 48,
          height: 48,
          zIndex: 0,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 60% 41%, #0ff7 45%, #181a2e 100%)",
          opacity: 0.27,
          filter: "blur(0.5px)"
        }}
        aria-hidden="true"
      ></div>

      {/* Icon */}
      <div
        style={{
          fontSize: "2.0rem",
          marginBottom: 8,
          zIndex: 1,
          textShadow: "0 0 7px var(--accent), 0 0 2px var(--primary)"
        }}
        aria-hidden="true"
      >
        {todayTip.icon}
      </div>

      {/* Widget title */}
      <div
        className="widget-title"
        style={{
          color: "var(--secondary)",
          fontWeight: 700,
          fontSize: "1.08rem",
          marginBottom: 7,
          letterSpacing: ".04em"
        }}
      >
        {todayTip.title}
      </div>
      <div
        style={{
          color: "var(--text-secondary)",
          fontSize: ".99rem",
          lineHeight: 1.55,
          marginBottom: 7,
          letterSpacing: ".01em",
          fontWeight: 500,
          zIndex: 1
        }}
      >
        {todayTip.content}
      </div>
      <span
        style={{
          borderRadius: 7,
          background: "rgba(20,255,255,0.11)",
          color: "var(--accent)",
          fontSize: "0.80em",
          fontWeight: 600,
          letterSpacing: ".05em",
          marginTop: "auto",
          opacity: 0.70,
          padding: "3.5px 12px 2.7px 12px",
          alignSelf: "flex-end",
        }}
      >
        Stay Private, Stay Secure
      </span>
    </div>
  );
}

export default DailyPrivacyTipCard;
