import React from "react";

/**
 * PUBLIC_INTERFACE
 * ExposureScoreCard: Shows user's digital exposure score using a cyber-styled radial (donut) chart and related info.
 * - Uses mock data; chart library dependency must be installed ("conic-gradient" for pure CSS, or Chart.js for real charts).
 * - Ready for Dashboard inclusion, follows cyber/dark theme.
 */
const mockScore = 76; // Out of 100

function getColor(score) {
  if (score > 80) return "var(--primary)";
  if (score > 50) return "var(--secondary)";
  return "#ff4e8a";
}

function ExposureScoreCard() {
  // For demo: CSS-only circular chart. Replace with real chart lib for more features
  const circumference = 165 * Math.PI;
  const percent = Math.min(100, Math.max(0, mockScore));
  const progress = circumference * (1 - percent / 100);

  return (
    <div
      className="card card-glow"
      style={{
        background: "var(--surface)",
        border: "1.5px solid var(--primary)",
        boxShadow: "0 0 28px 4px var(--primary), 0 0 14px 3px var(--secondary) inset",
        borderRadius: 20,
        minWidth: 240,
        maxWidth: 320,
        margin: "20px auto",
        textAlign: "center",
        position: "relative",
      }}
    >
      <div style={{ marginBottom: 10 }}>
        <div className="widget-title" style={{ fontSize: "1.15rem", fontWeight: 800 }}>
          Exposure Score
        </div>
        <div style={{ color: "var(--accent)", fontSize: 13, opacity: 0.72 }}>
          Real-Time Risk Index
        </div>
      </div>
      <div style={{ margin: "0 auto", width: 160, height: 160, position: "relative" }}>
        <svg width={160} height={160}>
          <circle
            cx={80}
            cy={80}
            r={68}
            stroke="var(--border-color)"
            strokeWidth={13}
            fill="none"
            style={{
              filter: "blur(0.5px)",
              opacity: 0.18,
            }}
          />
          <circle
            cx={80}
            cy={80}
            r={68}
            stroke={getColor(percent)}
            strokeWidth={13}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 1.1s cubic-bezier(.22,1.03,.64,.98)",
              filter: "drop-shadow(0 0 16px var(--primary))",
              opacity: 0.92,
            }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            top: "54%",
            left: "50%",
            transform: "translate(-50%,-56%)",
            width: "90px",
            color: "var(--primary)",
            fontSize: "2.47rem",
            fontWeight: 900,
            textShadow: "0 0 13px var(--primary), 0 0 2px var(--accent)",
            letterSpacing: "0.04em",
          }}
        >
          {percent}
        </div>
        <div
          style={{
            position: "absolute",
            top: "69%",
            left: "50%",
            transform: "translate(-50%,-48%)",
            color: "var(--text-secondary)",
            fontWeight: 600,
            fontSize: 15.5,
            letterSpacing: "0.03em",
            textShadow: "0 0 6px var(--surface)",
          }}
        >
          /100
        </div>
      </div>
      <div
        style={{
          marginTop: 14,
          color: "var(--text-secondary)",
          fontSize: 15.5,
          opacity: 0.86,
          minHeight: "1.48em",
        }}
      >
        {percent > 80
          ? "Excellent! Your exposure is very low."
          : percent > 50
          ? "Caution: Moderate privacy exposure."
          : "Critical! Your exposure is high."}
      </div>
    </div>
  );
}

export default ExposureScoreCard;
