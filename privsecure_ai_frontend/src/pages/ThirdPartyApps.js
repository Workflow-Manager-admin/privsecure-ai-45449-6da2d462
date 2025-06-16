import React from "react";

/**
 * PUBLIC_INTERFACE
 * ThirdPartyApps: Responsive grid view showing connected third-party apps' logos, name, access, trust rating & themed Revoke/Replace buttons.
 * Layout: Clean, modern, consistent with App theme. Uses mock app data. No backend.
 */
const MOCK_APPS = [
  {
    id: 1,
    logo: "https://cdn-icons-png.flaticon.com/512/732/732200.png", // Google
    name: "Google Drive",
    accessLevel: "Full Drive Access",
    trust: 89, // 0-100 trust
    trustLabel: "High",
    trustColor: "#0fdbae",
  },
  {
    id: 2,
    logo: "https://cdn-icons-png.flaticon.com/512/220/220236.png", // Slack
    name: "Slack ChatGen",
    accessLevel: "Basic Profile, Messages",
    trust: 76,
    trustLabel: "Medium",
    trustColor: "#13b9b9",
  },
  {
    id: 3,
    logo: "https://cdn-icons-png.flaticon.com/512/174/174857.png", // Facebook
    name: "FaceBook Syncer",
    accessLevel: "Friends List, Posts",
    trust: 58,
    trustLabel: "Low",
    trustColor: "#E87A41",
  },
  {
    id: 4,
    logo: "https://cdn-icons-png.flaticon.com/512/732/732221.png", // Dropbox
    name: "Dropbox Integrate",
    accessLevel: "Files (write), Email",
    trust: 91,
    trustLabel: "High",
    trustColor: "#0fdbae",
  },
  {
    id: 5,
    logo: "https://cdn-icons-png.flaticon.com/512/270/270798.png", // Twitter
    name: "QuickTweetbot",
    accessLevel: "Read Tweets, Profile, Analytics",
    trust: 61,
    trustLabel: "Medium",
    trustColor: "#13b9b9",
  },
  {
    id: 6,
    logo: "https://cdn-icons-png.flaticon.com/512/888/888879.png", // ChatGPT mock
    name: "SmartConnect AI",
    accessLevel: "Full Account, Messages",
    trust: 34,
    trustLabel: "Critical",
    trustColor: "#ff4e8a",
  },
];

// Helper for trust bar (score + text/icon)
function TrustScore({ score, label, color }) {
  let icon = "🔒";
  if (score > 85) icon = "🟢";
  else if (score > 70) icon = "🟡";
  else if (score > 50) icon = "🟠";
  else icon = "🔴";
  return (
    <div
      title={`Trust: ${label} (${score}/100)`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        fontWeight: 600,
        fontSize: ".99em",
        letterSpacing: ".03em",
        color: color,
        opacity: .99,
        fontFamily: "'Montserrat', 'Poppins', sans-serif"
      }}
    >
      <span aria-hidden="true" style={{ fontSize: "1.29em" }}>{icon}</span>
      <span style={{ marginRight: 4 }}>{label}</span>
      <span style={{
        minWidth: 31,
        fontSize: ".88em",
        color: "#6d7f98",
        opacity: 0.69
      }}>{score}/100</span>
    </div>
  );
}

// App card UI
function AppCard({ app }) {
  return (
    <div
      className="card"
      style={{
        height: "100%",
        border: "1.6px solid var(--border-color)",
        borderRadius: 15,
        boxShadow: "0 0 18px 2px var(--surface), 0 0 11px 3px var(--accent) inset",
        background: "linear-gradient(99deg,var(--surface) 90%, #e4fdfd 100%)",
        padding: "26px 22px 22px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        minWidth: 0,
        maxWidth: 320,
        margin: "auto",
        transition: "box-shadow 0.18s"
      }}
      tabIndex={0}
      aria-label={app.name}
    >
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginBottom: 9,
        width: "100%"
      }}>
        {/* Logo */}
        <img
          src={app.logo}
          alt={`${app.name} logo`}
          style={{
            width: 48,
            height: 48,
            borderRadius: 11,
            border: `2.2px solid ${app.trustColor}`,
            boxShadow: `0 0 9px 1.5px ${app.trustColor}`,
            background: "#fff",
            objectFit: "cover",
            marginRight: 2,
            marginLeft: 2
          }}
        />
        {/* Name & Access */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontWeight: 800,
            color: "var(--primary)",
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "1.13em",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
            marginBottom: 2
          }}>{app.name}</div>
          <div style={{
            color: "var(--text-secondary)",
            fontFamily: "'Lato','Montserrat',sans-serif",
            fontSize: ".97em",
            fontWeight: 600,
            opacity: .67
          }}>
            {app.accessLevel}
          </div>
        </div>
      </div>
      {/* Trust rating */}
      <div style={{
        margin: "10px 0 13px 2px",
        width: "100%",
        display: "flex",
        alignItems: "center"
      }}>
        <TrustScore score={app.trust} label={app.trustLabel} color={app.trustColor} />
      </div>
      {/* Actions Row */}
      <div style={{
        display: "flex",
        gap: 11,
        marginTop: "auto",
        width: "100%",
        justifyContent: "flex-end"
      }}>
        <button
          className="btn"
          style={{
            background: `linear-gradient(90deg,${app.trustColor} 50%,var(--primary) 95%)`,
            color: "#fff",
            fontWeight: 700,
            fontFamily: "'Montserrat', 'Poppins', sans-serif",
            border: "none",
            borderRadius: 8,
            padding: "9.5px 18px",
            boxShadow: `0 0 15px 2px ${app.trustColor}44`,
            letterSpacing: ".02em",
            fontSize: "1.03em"
          }}
          tabIndex={0}
          aria-label={`Revoke access for ${app.name}`}
        >
          Revoke
        </button>
        <button
          className="btn"
          style={{
            background: "linear-gradient(90deg,#e6f3fc 10%, var(--accent) 110%)",
            color: "var(--primary)",
            fontWeight: 700,
            border: "1.3px solid var(--accent)",
            borderRadius: 8,
            padding: "9.5px 18px",
            marginLeft: "-1px",
            fontFamily: "'Montserrat', 'Poppins', sans-serif",
            boxShadow: "0 0 5px 1px var(--accent)55 inset",
            letterSpacing: ".01em",
            fontSize: "1.03em"
          }}
          tabIndex={0}
          aria-label={`Replace or reconnect ${app.name}`}
        >
          Replace
        </button>
      </div>
    </div>
  );
}

function ThirdPartyApps() {
  return (
    <div className="container" style={{
      marginTop: 56,
      background: "var(--surface)",
      borderRadius: "var(--border-radius)",
      boxShadow: "var(--box-shadow)",
      maxWidth: 1120,
      minHeight: 440,
      width: "100%",
      color: "var(--text-primary)",
      padding: "44px 30px 35px"
    }}>
      <h1
        className="title"
        style={{
          fontFamily: "'Merriweather','Montserrat',serif",
          color: "var(--primary)",
          fontSize: "2.13rem",
          fontWeight: 900,
          marginBottom: 7,
          textShadow: "0 0 14px var(--accent), 0 0 6px var(--surface), 0 0 18px var(--primary)",
          letterSpacing: ".04em"
        }}
      >
        Third-Party App Scanner
      </h1>
      <div
        className="subtitle"
        style={{
          color: "var(--accent)",
          fontWeight: 600,
          fontSize: "1.11rem",
          marginBottom: 30
        }}
      >
        Review your connected apps. Revoke risky access and replace trusted services instantly.
      </div>
      {/* Responsive app grid */}
      <div
        className="dashboard-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(275px, 1fr))",
          gap: "32px",
          alignItems: "stretch",
          marginBottom: 0,
          width: "100%",
          maxWidth: 1390,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {MOCK_APPS.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
      {/* Style overrides for mobile grid */}
      <style>
        {`
        @media (max-width: 1050px) {
          .dashboard-grid {
            grid-template-columns: 1fr 1fr;
            gap: 18px;
            padding-left: 0;
            padding-right: 0;
          }
        }
        @media (max-width: 700px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
            gap: 10px;
            padding: 0 1vw;
          }
          .dashboard-grid > * {
            min-width: 0 !important;
            max-width: 97vw !important;
            margin-left: 0 !important;
          }
        }
        `}
      </style>
    </div>
  );
}

export default ThirdPartyApps;
