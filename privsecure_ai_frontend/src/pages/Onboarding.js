import React, { useState } from "react";
import "../App.css";

// PUBLIC_INTERFACE
// Multi-step onboarding for EchoGuard, editing only step 3: privacy goals + AI recommendation customization.

const PRIVACY_GOALS = [
  {
    id: "data-minimization",
    label: "Data Minimization",
    description: "Restrict collection/use to what's absolutely necessary.",
    icon: "📉" // (Can swap for themed SVGs later)
  },
  {
    id: "social-privacy",
    label: "Social Privacy",
    description: "Reduce unwanted social tracking, control profile exposure.",
    icon: "🕶️"
  },
  {
    id: "breach-alert",
    label: "Breach Alert",
    description: "Instant notifications if your data is found in breaches.",
    icon: "🚨"
  },
  {
    id: "behavior-protection",
    label: "Behavioral Shield",
    description: "Limit profiling & predictive targeting of your activities.",
    icon: "🛡️"
  },
  {
    id: "dark-web",
    label: "Dark Web Monitoring",
    description: "Scan for leaks of your info on the dark web.",
    icon: "🌑"
  }
];

const AI_RECOMMEND_PREFS = [
  {
    id: "action-plan",
    label: "AI Action Plan Tips",
    description: "Receive daily/weekly adaptive privacy checklists."
  },
  {
    id: "threat-warnings",
    label: "Critical Threat Warnings",
    description: "Be alerted to new or severe cyber threats."
  },
  {
    id: "privacy-trends",
    label: "Trend & Exposure Insights",
    description: "See periodic trend analyses and risk forecasts."
  }
];

const fontStack = "'Poppins','Montserrat','Lato','Raleway',Arial,sans-serif";

function Onboarding({ onFinish }) {
  // Minimal: simulate steps 1/2 with only step 3 interactive for this task
  const [step, setStep] = useState(3); // Only step 3 shown
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [aiPrefs, setAIPrefs] = useState(AI_RECOMMEND_PREFS.map(opt => ({ id: opt.id, enabled: true })));
  
  // Step 3: Interactive privacy goals and toggles
  function toggleGoal(goalId) {
    setSelectedGoals(sel =>
      sel.includes(goalId)
        ? sel.filter(g => g !== goalId)
        : [...sel, goalId]
    );
  }
  function toggleAIPref(prefId) {
    setAIPrefs(prefs =>
      prefs.map(p =>
        p.id === prefId ? { ...p, enabled: !p.enabled } : p
      )
    );
  }
  
  function handleSubmit(e) {
    e.preventDefault();
    // Normally would send onboarding selections to backend here!
    if (onFinish) onFinish({ privacyGoals: selectedGoals, aiPreferences: aiPrefs });
  }

  // Card selection appearance
  const selectedStyle = {
    border: "2px solid var(--primary)",
    background: "linear-gradient(93deg,#e8fdfe 60%,#e4f2fe 100%)",
    boxShadow: "0 0 13px 2px var(--primary), 0 0 5px var(--primary) inset"
  };

  if (step !== 3) {
    return (
      <div className="container page-main-surface" style={{ marginTop: 40, minHeight: 350 }}>
        {/* Non-implemented steps */}
        <h1 className="title" style={{ color: "var(--primary)", fontSize: "2.1rem" }}>Onboarding</h1>
        <div style={{ color: "var(--text-secondary)", fontSize: "1.13rem" }}>
          (Only Step 3 implemented for privacy goal selection. Please proceed.)
        </div>
        <button className="btn btn-large" style={{ marginTop: 26 }} onClick={() => setStep(3)}>
          Go to Step 3
        </button>
      </div>
    );
  }

  return (
    <div className="container page-main-surface" style={{ marginTop: 38, minHeight: 535 }}>
      <h1 className="title" style={{
        color: "var(--primary)",
        fontFamily: "'Merriweather','Montserrat',serif",
        textShadow: "0 0 13px var(--accent),0 0 6px var(--surface),0 0 15px var(--primary)",
        fontSize: "2.08rem",
        fontWeight: 900,
        marginBottom: 6
      }}>
        Let's personalize your<br />privacy experience
      </h1>
      <div className="subtitle" style={{
        color: "var(--accent)",
        fontWeight: 600,
        fontSize: "1.09rem",
        marginBottom: 6,
        letterSpacing: ".04em"
      }}>
        Step 3 of 3 &nbsp;|&nbsp; Select your privacy priorities &amp; AI recommendation style.
      </div>

      {/* Privacy Goals Card Grid */}
      <form onSubmit={handleSubmit}>
        <section aria-label="Privacy Goals" style={{ marginBottom: 30 }}>
          <div style={{
            fontWeight: 700, color: "var(--text-primary)", fontSize: "1.15em",
            marginBottom: 6, letterSpacing: ".013em", fontFamily: "'Montserrat',sans-serif"
          }}>
            1. What are your top privacy goals?
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(222px,1fr))",
              gap: "20px 16px",
              margin: "18px 0"
            }}
          >
            {PRIVACY_GOALS.map(goal => {
              const isSelected = selectedGoals.includes(goal.id);
              return (
                <button
                  type="button"
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className="card"
                  aria-pressed={isSelected}
                  tabIndex={0}
                  style={{
                    minHeight: 108,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: 18,
                    cursor: "pointer",
                    background: "var(--surface)",
                    borderRadius: 13,
                    border: "2px solid " + (isSelected ? "var(--primary)" : "var(--border-color)"),
                    boxShadow: isSelected
                      ? "0 0 20px 4px var(--primary), 0 0 11px var(--accent) inset"
                      : "var(--box-shadow)",
                    fontWeight: 700,
                    fontFamily: fontStack,
                    fontSize: "1.06rem",
                    transition: "border 0.18s, box-shadow 0.18s, background 0.14s",
                    outline: isSelected ? "2.5px solid var(--accent)" : "none",
                    ...(isSelected ? selectedStyle : {})
                  }}
                  onKeyDown={e => {
                    if (e.key === "Enter" || e.key === " ") toggleGoal(goal.id);
                  }}
                >
                  {/* icon */}
                  <span
                    style={{
                      fontSize: "2.1rem",
                      color: "var(--primary)",
                      flexShrink: 0,
                      filter: isSelected ? "drop-shadow(0 0 8px var(--primary))" : "none",
                      marginRight: 2,
                      marginLeft: 1
                    }}
                    aria-hidden="true"
                  >{goal.icon}</span>
                  <span style={{ flex: 1, textAlign: "left", display: "flex", flexDirection: "column", gap: 1 }}>
                    <span style={{
                      fontWeight: 700, color: isSelected ? "var(--primary)" : "var(--text-primary)",
                      fontSize: "1.11em", marginBottom: 1,
                      fontFamily: "'Montserrat',sans-serif", letterSpacing: ".01em"
                    }}>{goal.label}</span>
                    <span style={{
                      fontWeight: 500, fontSize: ".98em", color: "var(--text-secondary)", opacity: isSelected ? 0.63 : 1,
                      fontFamily: "'Lato','Poppins',sans-serif", marginTop: 3
                    }}>{goal.description}</span>
                  </span>
                  <span style={{
                    display: "inline-block", minWidth: 24, minHeight: 24, marginLeft: 7,
                    borderRadius: "50%", border: "2px solid " + (isSelected ? "var(--primary)" : "var(--border-color)"),
                    background: isSelected ? "var(--primary)" : "transparent",
                    boxShadow: isSelected ? "0 0 7px var(--accent)" : "none",
                    transition: "all 0.13s",
                  }}>
                    {isSelected &&
                      <span style={{
                        display: "block",
                        width: 10, height: 10,
                        margin: "5px auto",
                        borderRadius: "50%",
                        background: "var(--accent)"
                      }}></span>}
                  </span>
                </button>
              );
            })}
          </div>
          <div style={{ color: "var(--text-secondary)", fontSize: ".97em", margin: "3px 0 0 6px" }}>
            (Choose as many as apply. You can adjust your priorities anytime.)
          </div>
        </section>

        {/* AI Recommendation Preferences */}
        <section aria-label="AI Customization" style={{ marginBottom: 16 }}>
          <div style={{
            fontWeight: 700, color: "var(--text-primary)", fontSize: "1.15em",
            marginBottom: 6, letterSpacing: ".013em", fontFamily: "'Montserrat',sans-serif"
          }}>
            2. Choose which AI-powered privacy recommendations you want:
          </div>
          <div style={{
            display: "flex", flexDirection: "column", gap: 19, margin: "16px 4px 7px 0"
          }}>
            {AI_RECOMMEND_PREFS.map(opt => {
              const enabled = aiPrefs.find(p => p.id === opt.id)?.enabled;
              return (
                <label
                  key={opt.id}
                  style={{
                    display: "flex", alignItems: "center",
                    background: enabled
                      ? "linear-gradient(90deg,#f5feff 60%,#edfff9 100%)"
                      : "var(--surface)",
                    border: "2px solid " + (enabled ? "var(--accent)" : "var(--border-color)"),
                    borderRadius: 11,
                    boxShadow: enabled
                      ? "0 0 13px 2px var(--primary), 0 0 5px var(--accent) inset"
                      : "var(--box-shadow)",
                    padding: "14px 15px 11px 16px",
                    margin: 0,
                    minHeight: 48,
                    fontFamily: fontStack,
                    fontSize: "1.05rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "border 0.18s, box-shadow 0.18s, background 0.17s"
                  }}>
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={() => toggleAIPref(opt.id)}
                    style={{
                      accentColor: enabled ? "var(--primary)" : "var(--border-color)",
                      width: 19, height: 19, marginRight: 15, borderRadius: 7
                    }}
                    aria-checked={enabled}
                  />
                  <span>
                    <span style={{ color: enabled ? "var(--primary)" : "var(--text-primary)", fontWeight: 700, fontSize: "1.09em", letterSpacing: ".01em" }}>
                      {opt.label}
                    </span>
                    <span style={{
                      display: "block",
                      fontWeight: 400,
                      color: enabled ? "var(--text-secondary)" : "var(--text-secondary)",
                      opacity: enabled ? 0.74 : 1,
                      fontSize: ".98em"
                    }}>
                      {opt.description}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </section>

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-large"
          style={{
            marginTop: 36,
            fontWeight: 800,
            letterSpacing: ".025em",
            fontFamily: "'Montserrat',sans-serif"
          }}
          disabled={!selectedGoals.length}
        >
          Complete Onboarding
        </button>
      </form>
      {/* Custom style for selected card/toggle focus */}
      <style>
        {`
          .card:focus-visible, .card:active {
            box-shadow: 0 0 0 3px var(--accent), 0 0 16px 4px var(--primary);
            outline: 3px solid var(--accent);
            border-color: var(--primary) !important;
          }
        `}
      </style>
    </div>
  );
}

export default Onboarding;
