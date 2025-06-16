import React, { useState, useMemo } from "react";

// PUBLIC_INTERFACE
// AI-Powered Privacy Action Plan Page
// Interactive checklist, progress bar with streaks, accessible "Implement Now" buttons.
// Theme: Deep teal/cyber, fluid fonts, consistent with App.css.

const CHECKLIST = [
  {
    id: "update-passwords",
    label: "Update Weak or Reused Passwords",
    description: "Strengthen your account security by updating passwords across your key accounts.",
    ctaLabel: "Implement Now",
    priority: "high",
  },
  {
    id: "review-permissions",
    label: "Review Third-Party App Permissions",
    description: "Audit connected apps and revoke unnecessary permissions.",
    ctaLabel: "Implement Now",
    priority: "medium",
  },
  {
    id: "enable-2fa",
    label: "Enable Two-Factor Authentication",
    description: "Protect your accounts with 2FA where available.",
    ctaLabel: "Implement Now",
    priority: "high",
  },
  {
    id: "privacy-settings",
    label: "Adjust Privacy Settings on Social Media",
    description: "Limit public sharing and check visibility of your posts.",
    ctaLabel: "Implement Now",
    priority: "medium",
  },
  {
    id: "device-updates",
    label: "Update Device Software",
    description: "Keep your OS and apps up to date to prevent vulnerabilities.",
    ctaLabel: "Implement Now",
    priority: "low",
  },
  {
    id: "audit-leaks",
    label: "Audit for Data Leaks",
    description: "Run a scan to check for your info on the dark web.",
    ctaLabel: "Implement Now",
    priority: "high",
  },
];

const fontStack =
  "'Poppins', 'Merriweather', 'Montserrat', 'Lato', 'Raleway', Arial, Helvetica, sans-serif";

// Fake consistent privacy streak (demo: 3 days active)
const STREAK_DAYS = 3;
const TOTAL_DAYS = 7;

function ActionPlan() {
  const [checked, setChecked] = useState({});
  const completedCount = useMemo(
    () => Object.values(checked).filter(Boolean).length,
    [checked]
  );
  const progress = Math.round((completedCount / CHECKLIST.length) * 100);

  // Handler: checkbox toggle
  const handleToggle = (id) =>
    setChecked((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));

  // Handler: CTA button — for now, focus/visual effect only
  const handleCTA = (id) => {
    setChecked((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  return (
    <div
      className="container"
      style={{
        maxWidth: 525,
        marginTop: 66,
        background: "var(--surface)",
        borderRadius: "var(--border-radius)",
        boxShadow: "var(--box-shadow)",
        padding: "44px 30px 35px",
        fontFamily: fontStack,
        color: "var(--text-primary)",
      }}
    >
      <h1
        className="title"
        style={{
          fontFamily: "'Merriweather', 'Montserrat', serif",
          color: "var(--primary)",
          fontSize: "2.18rem",
          fontWeight: 900,
          marginBottom: 11,
          textShadow:
            "0 0 14px var(--accent), 0 0 6px var(--surface), 0 0 18px var(--primary)",
          letterSpacing: ".04em",
        }}
      >
        AI-Powered Privacy Action Plan
      </h1>
      <div
        className="subtitle"
        style={{
          color: "var(--accent)",
          fontWeight: 600,
          fontSize: "1.09rem",
          marginBottom: 10,
        }}
      >
        Step-by-step actions to strengthen your privacy, guided by AI insight.
      </div>

      {/* Progress bar + streak */}
      <section
        aria-label="Privacy Action Progress"
        style={{ margin: "24px 0 36px", position: "relative" }}
      >
        <div
          style={{
            width: "100%",
            height: 18,
            background: "linear-gradient(90deg,#f7fafb,var(--surface) 80%)",
            borderRadius: 10,
            border: "1.5px solid var(--border-color)",
            boxShadow: "0 0 12px 1px var(--surface), 0 0 4px 1px var(--accent)",
            marginBottom: 7,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            style={{
              height: "100%",
              width: `${progress}%`,
              background:
                "linear-gradient(93deg,var(--primary) 60%,var(--accent) 100%)",
              borderRadius: "9px",
              boxShadow: "0 0 11px 2px var(--primary)",
              transition: "width .37s cubic-bezier(.82,0,.19,1.01)",
              outline: progress === 100 ? "2.5px solid var(--accent)" : "none",
            }}
          ></div>
          {/* Streak indicator dots */}
          <div
            style={{
              position: "absolute",
              top: 2,
              right: 13,
              display: "flex",
              gap: 5,
              alignItems: "center",
            }}
          >
            {/* Visually show streak as filled dots for days active */}
            {Array(TOTAL_DAYS)
              .fill(0)
              .map((_, i) => (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    width: 8.5,
                    height: 8.5,
                    borderRadius: "50%",
                    marginLeft: i ? 1 : 0,
                    background:
                      i < STREAK_DAYS
                        ? "var(--primary)"
                        : "var(--border-color)",
                    boxShadow:
                      i < STREAK_DAYS
                        ? "0 0 8px var(--accent)"
                        : "0 0 0 0 transparent",
                    opacity: i < STREAK_DAYS ? 0.90 : 0.58,
                  }}
                  aria-label={
                    i < STREAK_DAYS
                      ? "Privacy streak day"
                      : "No streak"
                  }
                ></span>
              ))}
            {/* Streak label */}
            <span
              style={{
                fontSize: "0.85em",
                color: "var(--primary)",
                marginLeft: 7,
                fontWeight: 700,
                opacity: 0.82,
                fontFamily: "'Montserrat',sans-serif",
                letterSpacing: ".025em",
                textShadow: "0 0 7px var(--accent)",
              }}
            >
              {STREAK_DAYS}d streak
            </span>
          </div>
        </div>
        <div
          style={{
            color: "var(--text-secondary)",
            fontWeight: 500,
            fontSize: ".99em",
            textAlign: "right",
            marginTop: 3,
            opacity: 0.63,
            fontFamily: "'Montserrat',sans-serif",
            letterSpacing: ".03em",
          }}
        >
          {completedCount} of {CHECKLIST.length} actions complete
        </div>
      </section>

      {/* Checklist */}
      <form
        aria-label="Privacy Action Checklist"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          marginTop: 12,
        }}
      >
        {CHECKLIST.map((item, idx) => {
          const done = !!checked[item.id];
          return (
            <div
              key={item.id}
              className="card card-glow"
              style={{
                background: done
                  ? "linear-gradient(90deg,var(--surface) 80%,#e4fdfd 100%)"
                  : "var(--surface)",
                border:
                  done
                    ? "1.7px solid var(--accent)"
                    : "1.5px solid var(--border-color)",
                borderRadius: "12px",
                padding: "21px 18px 17px 18px",
                display: "flex",
                alignItems: "flex-start",
                boxShadow: done
                  ? "0 0 12px 2px var(--primary)"
                  : "0 0 8px 1px var(--surface)",
                gap: 23,
                opacity: done ? 0.72 : 1,
                transition: "opacity 0.18s, background 0.18s",
                position: "relative",
              }}
            >
              {/* Accessible Toggle Checkbox */}
              <label
                htmlFor={`cbx-${item.id}`}
                style={{
                  marginRight: 7,
                  marginTop: 3,
                  cursor: "pointer",
                  minWidth: 28,
                }}
              >
                <input
                  type="checkbox"
                  id={`cbx-${item.id}`}
                  checked={!!checked[item.id]}
                  onChange={() => handleToggle(item.id)}
                  aria-checked={!!checked[item.id]}
                  aria-label={
                    done
                      ? `Mark "${item.label}" as incomplete`
                      : `Mark "${item.label}" as done`
                  }
                  style={{
                    accentColor: done
                      ? "var(--primary)"
                      : "var(--border-color)",
                    width: 19,
                    height: 19,
                    borderRadius: 7,
                    marginRight: 4,
                    boxShadow: done
                      ? "0 0 8px var(--primary)"
                      : "0 0 0 0 transparent",
                  }}
                />
              </label>
              {/* Checklist Content */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "1.13em",
                    color: done ? "var(--primary)" : "var(--text-primary)",
                    letterSpacing: 0.01,
                    textDecoration: done ? "line-through" : "none",
                    fontFamily: "'Montserrat',sans-serif",
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    color: done ? "var(--text-secondary)" : "var(--text-secondary)",
                    opacity: done ? 0.65 : 1,
                    fontSize: ".97em",
                    marginTop: 3,
                    marginBottom: 5,
                    fontFamily: "'Lato','Poppins',sans-serif",
                  }}
                >
                  {item.description}
                </div>
                {/* CALL TO ACTION BUTTON */}
                <button
                  type="button"
                  className="btn btn-large"
                  style={{
                    background: done
                      ? "linear-gradient(92deg,#e3fcea,#b0fff1 90%)"
                      : "linear-gradient(96deg, var(--primary) 68%, var(--secondary) 110%)",
                    color: done ? "var(--primary)" : "#fff",
                    filter: done ? "grayscale(0.16)" : "none",
                    fontWeight: 700,
                    letterSpacing: ".01em",
                    pointerEvents: done ? "none" : "auto",
                    boxShadow: done
                      ? "none"
                      : "0 0 17px 2px var(--accent), 0 0 5px 1px var(--secondary)",
                    border: "none",
                    opacity: done ? 0.5 : 1,
                    minWidth: 146,
                    marginTop: 7,
                    marginBottom: 0,
                    fontFamily: "'Montserrat',sans-serif",
                    outline: "none",
                    transition:
                      "background .17s, color .14s, box-shadow 0.18s, opacity 0.17s",
                  }}
                  tabIndex={done ? -1 : 0}
                  aria-disabled={done}
                  onClick={() => handleCTA(item.id)}
                  onKeyDown={(e) => {
                    if (
                      !done &&
                      (e.key === "Enter" || e.key === " ")
                    ) {
                      handleCTA(item.id);
                    }
                  }}
                  role="button"
                  // Accessible aria-live
                  aria-live="polite"
                  aria-label={
                    done
                      ? `Action already completed: ${item.label}`
                      : `Start: ${item.label}`
                  }
                  // Custom hover via style for cyber effect
                  onMouseOver={e => {
                    if (!done) {
                      e.currentTarget.style.background =
                        "linear-gradient(92deg,#0ff7 8%,var(--primary) 72%,#13b9b9 98%)";
                      e.currentTarget.style.color = "var(--primary)";
                      e.currentTarget.style.boxShadow =
                        "0 0 18px 7px var(--secondary), 0 0 10px 3px var(--primary)";
                    }
                  }}
                  onMouseOut={e => {
                    if (!done) {
                      e.currentTarget.style.background =
                        "linear-gradient(96deg, var(--primary) 68%, var(--secondary) 110%)";
                      e.currentTarget.style.color = "#fff";
                      e.currentTarget.style.boxShadow =
                        "0 0 17px 2px var(--accent), 0 0 5px 1px var(--secondary)";
                    }
                  }}
                >
                  {item.ctaLabel}
                </button>
              </div>
            </div>
          );
        })}
      </form>

      {/* Completion message */}
      {completedCount === CHECKLIST.length && (
        <div
          style={{
            margin: "31px 0 0",
            fontWeight: 700,
            color: "var(--primary)",
            textAlign: "center",
            fontSize: "1.16em",
            letterSpacing: ".02em",
            textShadow: "0 0 11px var(--accent)",
            fontFamily: "'Montserrat',sans-serif",
          }}
          aria-live="polite"
        >
          🎉 Congratulations! All recommended actions complete.<br />
          Keep up your privacy streak!
        </div>
      )}

      {/* Added cyber style for accessibility focus */}
      <style>
        {`
        button.btn[aria-disabled="true"], .btn[disabled], button.btn:disabled {
          pointer-events: none;
          opacity: 0.4;
        }
        button.btn:focus, .btn:focus {
          box-shadow: 0 0 0 2px var(--accent), 0 0 15px 3px var(--primary);
          outline: 2.2px solid var(--accent);
        }
        `}
      </style>
    </div>
  );
}

export default ActionPlan;
