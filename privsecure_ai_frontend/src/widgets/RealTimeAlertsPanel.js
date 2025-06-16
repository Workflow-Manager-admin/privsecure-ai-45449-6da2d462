import React from "react";

/**
 * PUBLIC_INTERFACE
 * RealTimeAlertsPanel: Modular, cyber-themed panel for recent/privacy alerts.
 * - Uses mock data for real-time alert "stream".
 * - Ready for live integration; visually distinct—glow, accent badges, and timeline cues.
 * - Responsive and theme-matched for dashboard grid.
 */
const mockAlerts = [
  {
    id: 1,
    type: "Breach",
    severity: "Critical",
    message: "Data breach detected: Unusual login from Moscow, RU.",
    time: "1m ago",
    icon: "⛔️",
  },
  {
    id: 2,
    type: "Permissions",
    severity: "High",
    message: "A new app (ChatGenX) accessed your contacts.",
    time: "6m ago",
    icon: "🔑",
  },
  {
    id: 3,
    type: "Leak",
    severity: "Medium",
    message: "Potential email leak found on dark web.",
    time: "18m ago",
    icon: "🕵️",
  },
  {
    id: 4,
    type: "System",
    severity: "Info",
    message: "Device synced successfully. Protection active.",
    time: "30m ago",
    icon: "✅",
  },
];

const severityDetails = {
  Critical: { color: "#ff4e8a", glow: "#ff4e8a77" },
  High: { color: "var(--accent)", glow: "#0ff77" },
  Medium: { color: "var(--secondary)", glow: "#f0f7" },
  Info: { color: "var(--primary)", glow: "#0ff55" },
};

// Helper for theme badge based on severity/type
function AlertBadge({ type, severity }) {
  const det = severityDetails[severity] || severityDetails.Info;
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: ".86em",
        padding: "3.5px 11px",
        marginRight: 9,
        color: det.color,
        fontWeight: 700,
        borderRadius: 9,
        border: `1.7px solid ${det.color}`,
        letterSpacing: "0.03em",
        background: `linear-gradient(93deg, #171c2c 60%, ${det.glow} 120%)`,
        boxShadow: `0 0 8px 1px ${det.glow}`,
      }}
    >
      {type}
    </span>
  );
}

// PUBLIC_INTERFACE
function RealTimeAlertsPanel() {
  return (
    <div
      className="card card-glow"
      style={{
        background: "linear-gradient(120deg, #191b34 80%, #141622 100%)",
        border: "1.5px solid var(--secondary)",
        boxShadow:
          "0 1px 26px 2px #f0f7, 0 0 15px 2px #0ff8 inset",
        borderRadius: 20,
        minWidth: 270,
        maxWidth: 360,
        flex: "1 1 270px",
        margin: "20px auto",
        color: "var(--text-primary)",
        position: "relative",
        overflow: "hidden",
      }}
      aria-label="Recent Alerts Panel"
    >
      <div
        className="widget-title"
        style={{
          fontWeight: 800,
          fontSize: "1.12rem",
          marginBottom: 4,
          color: "var(--secondary)",
        }}
      >
        Real-Time Alerts
      </div>
      <div
        style={{
          color: "var(--accent)",
          fontSize: 13,
          opacity: 0.79,
          marginBottom: 13,
          letterSpacing: ".01em",
        }}
      >
        Threats & Events Stream (mock data)
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          minHeight: 180,
          marginTop: 6,
          paddingRight: 2,
        }}
      >
        {mockAlerts.map((alert) => {
          const det = severityDetails[alert.severity] || severityDetails.Info;
          return (
            <div
              key={alert.id}
              className="cyber-alert-entry"
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 11,
                background: "rgba(20,22,34,0.7)",
                borderRadius: 10,
                boxShadow:
                  alert.severity === "Critical"
                    ? "0 0 14px 2.5px #ff4e8a77"
                    : det.glow
                    ? `0 0 8px 1.6px ${det.glow}`
                    : "0 0 4px 1px var(--primary)",
                border: `1.2px solid ${det.color}`,
                padding: "9px 12px 9px 10px",
                position: "relative",
                overflow: "hidden",
                transition: "box-shadow 0.18s",
              }}
              aria-label={`${alert.severity} Alert: ${alert.message}`}
            >
              {/* Icon with cyber pulse */}
              <span
                style={{
                  fontSize: "1.27em",
                  marginRight: 4,
                  textShadow:
                    alert.severity === "Critical"
                      ? "0 0 10px #ff4e8a, 0 0 4px #fff"
                      : "0 0 7px var(--primary), 0 0 2px #f0f",
                  filter:
                    alert.severity === "Critical"
                      ? "drop-shadow(0 0 14px #ff4e8a77)"
                      : "",
                  marginTop: 2,
                }}
                aria-hidden="true"
              >
                {alert.icon}
              </span>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 4,
                    marginBottom: 3,
                  }}
                >
                  <AlertBadge type={alert.type} severity={alert.severity} />
                  <span
                    style={{
                      color: det.color,
                      fontWeight: 700,
                      fontSize: ".94em",
                      textShadow: `0 0 9px ${det.glow}`,
                      marginRight: 5,
                      letterSpacing: ".01em",
                    }}
                  >
                    {alert.severity}
                  </span>
                  <span
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: ".86em",
                      marginLeft: 5,
                      opacity: 0.74,
                    }}
                  >
                    {alert.time}
                  </span>
                </div>
                <div
                  style={{
                    color: "var(--text-primary)",
                    fontSize: ".98em",
                    lineHeight: 1.38,
                    letterSpacing: ".005em",
                    maxWidth: 280,
                  }}
                >
                  {alert.message}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 10,
          right: 17,
          fontSize: "0.95em",
          color: "var(--primary)",
          opacity: 0.61,
          letterSpacing: ".03em",
        }}
      >
        Live stream integration coming soon
      </div>
    </div>
  );
}

export default RealTimeAlertsPanel;
