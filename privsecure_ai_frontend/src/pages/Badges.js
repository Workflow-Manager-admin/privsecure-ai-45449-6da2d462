import React, { useMemo } from "react";

// PUBLIC_INTERFACE
// Badge System page: Shows earned badge grid (animated), leaderboard (mock), and XP bar
// Responsive, styled to theme colors/typography

const BADGES = [
  {
    id: 1,
    name: "Privacy Champion",
    desc: "Completed 100% of privacy checks",
    icon: "🛡️",
    color: "#13B9B9",
  },
  {
    id: 2,
    name: "Phishing Defender",
    desc: "Reported suspicious activity",
    icon: "🚨",
    color: "#e87a41",
  },
  {
    id: 3,
    name: "Ghost Mode",
    desc: "Enabled maximum privacy mode",
    icon: "👻",
    color: "#055C5C",
  },
  {
    id: 4,
    name: "Data Guardian",
    desc: "No leaks in 90 days",
    icon: "🔒",
    color: "#1A1A1A",
  },
  {
    id: 5,
    name: "Sync Master",
    desc: "All devices synced securely",
    icon: "🔗",
    color: "#13B9B9",
  },
  {
    id: 6,
    name: "Trendsetter",
    desc: "Top scorer for privacy streak",
    icon: "🔥",
    color: "#e87a41",
  },
];

const LEADERBOARD_MOCK = [
  { name: "Alice", badges: 12, xp: 4500 },
  { name: "Bob", badges: 11, xp: 4300 },
  { name: "Priya", badges: 10, xp: 4100 },
  { name: "Max", badges: 9, xp: 3850 },
  { name: "You", badges: 8, xp: 3590 },
];

const USER_XP = 3590; // out of 5000 for this level

// XP reward "milestones"
const XP_LEVELS = [
  { threshold: 0, label: "Novice" },
  { threshold: 1000, label: "Learner" },
  { threshold: 2500, label: "Achiever" },
  { threshold: 4000, label: "Elite" },
  { threshold: 5000, label: "Legend" },
];

// XP progress bar width calculation
function getXPProgress(xp, levels) {
  const max = levels[levels.length - 1].threshold;
  return Math.min((xp / max) * 100, 100);
}

// Utility for responsive column count
function getGridTemplateCols() {
  if (window.innerWidth < 600) return "1fr 1fr";
  if (window.innerWidth < 900) return "1fr 1fr 1fr";
  return "1fr 1fr 1fr";
}

export default function Badges() {
  // Used for XP next milestone
  const nextMilestone = useMemo(() => {
    for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
      if (USER_XP >= XP_LEVELS[i].threshold) {
        return XP_LEVELS[Math.min(i + 1, XP_LEVELS.length - 1)];
      }
    }
    return XP_LEVELS[0];
  }, []);

  // Responsive grid: fallback, as it's styled inline/CSS too.
  const gridCols = useMemo(getGridTemplateCols, []);

  return (
    <div className="container" style={{ gap: "2.5rem", minHeight: 600 }}>
      <h1 className="page-title" style={{
        letterSpacing: "0.11em",
        color: "var(--primary)",
        fontWeight: 900,
        textShadow: "0 0 12px var(--accent), 0 0 8px var(--primary)"
      }}>Your Badge Collection & Leaderboard</h1>

      {/* XP Progress/Rewards */}
      <section className="card" style={{
        padding: '20px 18px 30px 18px',
        background: "var(--surface)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <div style={{ width: "100%", marginBottom: 7, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <span className="subtitle" style={{ fontWeight: 700, color: "var(--secondary)" }}>XP Progress</span>
          <span style={{ color: "var(--primary)", fontSize: "1.03rem" }}>{USER_XP} / 5000 XP</span>
        </div>
        <div style={{
          width: "100%",
          background: "rgba(19,185,185,0.12)",
          borderRadius: 8,
          height: 20,
          boxShadow: "0 1px 7px 0 var(--secondary) inset"
        }}>
          <div style={{
            width: getXPProgress(USER_XP, XP_LEVELS) + "%",
            background: "linear-gradient(90deg,var(--primary), var(--accent) 90%)",
            height: "100%",
            borderRadius: 8,
            transition: "width 0.6s cubic-bezier(.35,.9,.41,1.47)",
            boxShadow: "0 0 8px 2px var(--accent)"
          }} />
        </div>
        {/* Rewards meter point/milestone */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          width: "98%",
          marginTop: 7,
          fontSize: "0.92rem"
        }}>
          {XP_LEVELS.map((lv, i) => (
            <div key={lv.label} style={{
              color: USER_XP >= lv.threshold ? "var(--primary)" : "var(--border-color)",
              fontWeight: USER_XP >= lv.threshold ? 700 : 400,
              textShadow: USER_XP >= lv.threshold
                ? "0 0 4px var(--accent), 0 0 1px var(--secondary)"
                : "none"
            }}>
              {lv.label}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, fontSize: 16, color: "var(--text-secondary)" }}>
          {USER_XP >= nextMilestone.threshold
            ? `Next reward: ${nextMilestone.label} at ${nextMilestone.threshold} XP`
            : `Keep going!`}
        </div>
      </section>

      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: 32,
        margin: "0 auto",
        width: "100%",
        maxWidth: 980,
      }}>
        {/* Badge grid */}
        <section
          className="card"
          style={{
            background: "var(--surface)",
            minHeight: 260,
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            flexGrow: 3,
          }}>
          <div style={{
            fontWeight: 700,
            color: "var(--text-secondary)",
            fontSize: "1.33rem",
            marginBottom: 14,
            letterSpacing: "0.07em"
          }}>Earned Badges</div>
          <div
            className="badge-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))",
              gap: "1.0rem",
              width: "100%",
            }}
          >
            {BADGES.map((badge, idx) => (
              <div
                key={badge.id}
                className="badge-card pulse-cyber"
                style={{
                  animation: `badge-in 0.7s ${idx * 0.13 + 0.2}s cubic-bezier(.35,.9,.41,1.47) both`,
                  background: `linear-gradient(140deg,${badge.color}33 65%,var(--surface) 100%)`,
                  border: `2px solid ${badge.color}`,
                  borderRadius: 13,
                  padding: 14,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: badge.color.includes("e87a41")
                    ? "0 0 16px 2px #e87a4120"
                    : "0 0 11px 2px var(--primary)",
                  transition: "transform 0.14s",
                  cursor: "pointer",
                  position: "relative",
                  minHeight: 108,
                  minWidth: 0,
                  willChange: "transform"
                }}
                tabIndex={0}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.06) rotate(-1.5deg)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "" }}
                aria-label={`Badge: ${badge.name}`}
              >
                <span style={{
                  fontSize: 42,
                  textShadow: `0 0 12px ${badge.color},0 0 2px var(--secondary)`,
                  marginBottom: 6
                }}>{badge.icon}</span>
                <div style={{
                  fontWeight: 700,
                  color: badge.color,
                  fontSize: "1.05rem",
                  marginBottom: 2,
                  letterSpacing: "0.05em"
                }}>{badge.name}</div>
                <div style={{
                  textAlign: "center", color: "var(--text-secondary)",
                  fontSize: "0.95rem", fontWeight: 400,
                  marginTop: 2
                }}>{badge.desc}</div>
              </div>
            ))}
          </div>
        </section>
        {/* Leaderboard */}
        <section className="card" style={{
          background: "var(--surface)",
          padding: 18,
          minWidth: 0,
          maxWidth: 375,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column"
        }}>
          <div style={{
            fontWeight: 700,
            fontSize: "1.24rem",
            color: "var(--primary)",
            marginBottom: 8,
            letterSpacing: "0.07em"
          }}>Leaderboard</div>
          <div>
            {LEADERBOARD_MOCK.map((user, i) => (
              <div key={i} style={{
                display: "flex",
                alignItems: "center",
                background: user.name === "You"
                  ? "linear-gradient(90deg,var(--secondary) 12%, var(--surface) 98%)"
                  : i < 3 ? "linear-gradient(90deg,#e8f7f7 60%,var(--surface) 98%)" : "none",
                borderRadius: 8,
                marginBottom: 9,
                padding: "7px 12px",
                fontWeight: i < 3 || user.name === "You" ? 700 : 500,
                boxShadow: user.name === "You" ? "0 0 12px 1px var(--accent)" : "none"
              }}>
                <div style={{
                  width: 28,
                  color: i === 0 ? "#e87a41" : (i === 1 ? "#13B9B9" : i === 2 ? "#055C5C" : "#aaa"),
                  fontWeight: 700,
                  fontSize: "1.08rem",
                  flexShrink: 0,
                  textAlign: "right"
                }}>{i + 1}</div>
                <div style={{ flex: 1, marginLeft: 14, color: "var(--text-primary)" }}>
                  {user.name}
                </div>
                <div style={{ width: 64, color: "var(--secondary)", fontWeight: 600, fontSize: "1.03rem", textAlign: "right" }}>
                  {user.badges} <span title="Badges">🏅</span>
                </div>
                <div style={{ width: 70, color: "var(--accent)", fontWeight: 500, textAlign: "right", fontSize: "0.99rem" }}>
                  {user.xp} XP
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <style>
        {`
          @keyframes badge-in {
            0% { opacity: 0; transform: translateY(30px) scale(0.96);}
            82% { opacity: 1; transform: translateY(-6px) scale(1.10);}
            100% { opacity: 1; transform: translateY(0) scale(1);}
          }
          .pulse-cyber {
            animation: pulse-cyber 1.8s infinite;
          }
          @media (max-width: 900px) {
            .badge-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
          @media (max-width: 600px) {
            .container{ padding: 13px 4vw;}
            .badge-grid { grid-template-columns: 1fr 1fr !important; }
            .card { padding: 10px 4px !important; }
          }
          @media (max-width: 650px) {
            .page-title { font-size: 1.35rem !important;}
          }
          @media (max-width: 880px) {
            /* Stack leaderboard below badges on small screen */
            .card { margin-bottom: 12px !important; }
            div[style*='grid-template-columns: 2fr 1fr'] {
              grid-template-columns: 1fr !important;
              gap: 10px !important;
            }
            .card section { min-width: 0 !important; max-width: 96vw !important;}
          }
        `}
      </style>
    </div>
  );
}
