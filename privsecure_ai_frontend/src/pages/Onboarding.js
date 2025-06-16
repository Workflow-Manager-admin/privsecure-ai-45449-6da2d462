import React, { useState } from "react";
import "../App.css";

/**
 * PUBLIC_INTERFACE
 * Onboarding: Cyber/dark-themed step-by-step onboarding wizard.
 * Steps: 1) Permissions, 2) Device Sync, 3) Goal Selection.
 * - Visual stepper, accessible focus, keyboard nav, and clear instructions.
 * - No backend logic, pure UI.
 * Props:
 *   - onFinish: function to call on onboarding completion.
 */
const steps = [
  {
    label: "Permissions",
    description: "Set up basic permissions for smarter risk alerts.",
  },
  {
    label: "Device Sync",
    description: "Connect this device for real-time privacy protection.",
  },
  {
    label: "Goal Selection",
    description: "Select your top privacy goals to customize your experience.",
  },
];

function Onboarding({ onFinish }) {
  const [stepIndex, setStepIndex] = useState(0);
  // Example state for demo purposes (not persisted)
  const [permissions, setPermissions] = useState({
    notifications: false,
    location: false,
    deviceAccess: false,
  });
  const [sync, setSync] = useState({ syncing: true });
  const [goals, setGoals] = useState([]);

  // Accessibility: focus step area when changed
  const stepContentRef = React.useRef(null);
  React.useEffect(() => {
    if (stepContentRef.current) stepContentRef.current.focus();
  }, [stepIndex]);

  // Handler for stepper navigation (allow click and Enter/Space keyboard nav)
  const handleStepClick = (idx) => setStepIndex(idx);

  // Permissions form handlers
  const togglePermission = (name) =>
    setPermissions((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));

  // Fake device sync; no real backend/device API
  const handleFakeSync = () =>
    setSync((prev) => ({ ...prev, syncing: !prev.syncing }));

  // Privacy goals list
  const privacyGoalOptions = [
    "Reduce Data Sharing",
    "Detect Account Leaks",
    "Strengthen Authentication",
    "Limit Ad Tracking",
    "Monitor App Permissions",
    "Protect Family Members",
    "Erase Old Content",
  ];

  // Multi-select goal handler
  const handleGoalToggle = (goal) =>
    setGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );

  // Navigation
  const canContinue =
    (stepIndex === 0 && Object.values(permissions).some(Boolean)) ||
    (stepIndex === 1 && !sync.syncing) ||
    (stepIndex === 2 && goals.length > 0);

  const handleNext = () => {
    if (stepIndex < steps.length - 1) setStepIndex(stepIndex + 1);
    else onFinish && onFinish();
  };
  const handleBack = () => setStepIndex(Math.max(0, stepIndex - 1));

  // Cyber/futuristic style helpers
  const stepperStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 36,
    gap: 0,
    userSelect: "none",
  };

  const stepBtnStyle = (active, completed) => ({
    background: active
      ? "linear-gradient(100deg,var(--primary),var(--secondary) 80%)"
      : completed
      ? "linear-gradient(80deg,var(--surface),#21223b 95%)"
      : "var(--surface)",
    color: active ? "#141622" : "var(--text-secondary)",
    border: `2.2px solid ${
      active ? "var(--primary)" : completed ? "var(--border-color)" : "var(--border-color)"
    }`,
    outline: active ? "var(--focus-glow)" : "none",
    boxShadow: active
      ? "0 0 8px 2px var(--secondary)"
      : completed
      ? "0 0 5px 2px var(--primary) inset"
      : "0 0 0 0 transparent",
    borderRadius: "50%",
    width: 36,
    height: 36,
    fontWeight: 700,
    marginRight: 0,
    marginLeft: 0,
    transition: "all 0.14s",
    marginBottom: 0,
    cursor: completed || active ? "pointer" : "default",
    position: "relative",
    zIndex: 2,
  });

  const stepLabelStyle = (active, completed) => ({
    color: active ? "var(--primary)" : completed ? "var(--secondary)" : "var(--text-secondary)",
    fontWeight: active ? 700 : 500,
    fontSize: "1.1em",
    letterSpacing: "0.05em",
    margin: "0 8px",
    textAlign: "center",
    transition: "color 0.18s",
    textShadow: active
      ? "0 0 10px var(--accent)"
      : completed
      ? "0 0 6px var(--secondary)"
      : "none",
    marginTop: 3,
    marginBottom: 2,
  });

  return (
    <div
      className="container"
      style={{
        maxWidth: 460,
        margin: "90px auto 0",
        background: "var(--surface)",
        borderRadius: "var(--border-radius)",
        boxShadow: "var(--box-shadow)",
        padding: "40px 26px 38px",
        color: "var(--text-primary)",
        position: "relative",
      }}
    >
      {/* Visual Stepper */}
      <nav
        aria-label="Onboarding steps"
        style={stepperStyle}
        role="tablist"
        tabIndex={-1}
      >
        {steps.map((step, idx) => {
          const active = idx === stepIndex;
          const completed = idx < stepIndex;
          return (
            <React.Fragment key={step.label}>
              <button
                type="button"
                aria-current={active ? "step" : undefined}
                aria-label={step.label}
                tabIndex={active ? 0 : -1}
                style={stepBtnStyle(active, completed)}
                className={
                  "pulse-cyber" +
                  (active ? " btn" : "") +
                  (completed ? " card-glow" : "")
                }
                onClick={() => {
                  if (completed) handleStepClick(idx);
                }}
                onKeyDown={(e) => {
                  if (
                    (e.key === "Enter" || e.key === " ") &&
                    (active || completed)
                  ) {
                    handleStepClick(idx);
                  }
                }}
                disabled={!completed && !active}
              >
                {completed ? "✓" : idx + 1}
              </button>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minWidth: 56,
                }}
              >
                <span style={stepLabelStyle(active, completed)}>
                  {step.label}
                </span>
                {idx < steps.length - 1 && (
                  <div
                    aria-hidden="true"
                    style={{
                      width: 24,
                      height: 2.5,
                      background:
                        completed && idx + 1 <= stepIndex
                          ? "var(--accent)"
                          : "var(--border-color)",
                      margin: "8px auto",
                      borderRadius: 8,
                      boxShadow:
                        completed && idx + 1 <= stepIndex
                          ? "0 0 8px var(--secondary)"
                          : "none",
                    }}
                  />
                )}
              </div>
            </React.Fragment>
          );
        })}
      </nav>
      <section
        aria-labelledby={`step-title-${stepIndex}`}
        tabIndex={-1}
        ref={stepContentRef}
        style={{
          outline: "none",
          minHeight: 180,
          paddingBottom: 12,
        }}
      >
        {/* Step Content */}
        {stepIndex === 0 && (
          <div>
            <h2
              id="step-title-0"
              className="subtitle"
              style={{
                fontWeight: 700,
                fontSize: "1.3em",
                marginBottom: 5,
                color: "var(--accent)",
              }}
            >
              Grant Permissions
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                lineHeight: 1.55,
                fontSize: "1em",
                marginBottom: 14,
                marginTop: 2,
              }}
            >
              Enable permissions to unlock proactive privacy protection. <br />
              (Demo: toggle one or more.)
            </p>

            <form
              role="group"
              aria-labelledby="step-title-0"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                alignItems: "flex-start",
                marginTop: 16,
                marginBottom: 16,
              }}
              onSubmit={(e) => {
                e.preventDefault();
                handleNext();
              }}
            >
              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  checked={permissions.notifications}
                  onChange={() => togglePermission("notifications")}
                  aria-checked={permissions.notifications}
                  aria-label="Enable smart notifications"
                  style={{ marginRight: 7 }}
                />
                <span>Enable smart notifications</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  checked={permissions.location}
                  onChange={() => togglePermission("location")}
                  aria-checked={permissions.location}
                  aria-label="Allow location for risk analysis"
                  style={{ marginRight: 7 }}
                />
                <span>Allow location for risk analysis</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  checked={permissions.deviceAccess}
                  onChange={() => togglePermission("deviceAccess")}
                  aria-checked={permissions.deviceAccess}
                  aria-label="Sync device metadata"
                  style={{ marginRight: 7 }}
                />
                <span>Sync device metadata</span>
              </label>
            </form>
          </div>
        )}
        {stepIndex === 1 && (
          <div>
            <h2
              id="step-title-1"
              className="subtitle"
              style={{
                fontWeight: 700,
                fontSize: "1.3em",
                marginBottom: 5,
                color: "var(--accent)",
              }}
            >
              Device Sync
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                lineHeight: 1.55,
                fontSize: "1em",
                marginBottom: 14,
                marginTop: 2,
              }}
            >
              Connect this device to monitor privacy risks in real-time.
              <br />
              (Demo: Click "Connect" to trigger device sync.)
            </p>
            <div
              style={{
                margin: "30px 0 28px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <button
                type="button"
                className={`btn btn-large pulse-cyber`}
                onClick={handleFakeSync}
                style={{
                  margin: "0 auto",
                  background: sync.syncing
                    ? "linear-gradient(90deg,var(--primary),var(--secondary) 90%)"
                    : "linear-gradient(90deg,var(--surface),var(--secondary) 90%)",
                  color: sync.syncing ? "var(--background)" : "var(--accent)",
                  fontWeight: 700,
                  letterSpacing: "0.03em",
                  opacity: sync.syncing ? 1 : 0.9,
                }}
                aria-pressed={!sync.syncing}
                aria-label={
                  sync.syncing ? "Connect Device" : "Device Connected"
                }
                disabled={!sync.syncing}
              >
                {sync.syncing ? "Connect Device" : "Device Connected! ✓"}
              </button>
              {!sync.syncing && (
                <span
                  style={{
                    marginTop: 18,
                    color: "var(--primary)",
                    fontWeight: 600,
                    fontSize: "1.04em",
                    textShadow: "0 0 6px var(--accent)",
                  }}
                  aria-live="polite"
                >
                  Device securely synced.
                </span>
              )}
            </div>
          </div>
        )}
        {stepIndex === 2 && (
          <div>
            <h2
              id="step-title-2"
              className="subtitle"
              style={{
                fontWeight: 700,
                fontSize: "1.26em",
                marginBottom: 6,
                color: "var(--accent)",
              }}
            >
              Choose Your Privacy Goals
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                lineHeight: 1.5,
                fontSize: "0.99em",
                marginBottom: 16,
              }}
            >
              What matters most to you? Select 1 or more priorities to tailor your protection.
            </p>
            <form
              role="group"
              aria-labelledby="step-title-2"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                marginTop: 7,
                marginBottom: 18,
              }}
              onSubmit={(e) => {
                e.preventDefault();
                handleNext();
              }}
            >
              {privacyGoalOptions.map((goal) => (
                <label
                  key={goal}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontWeight: goals.includes(goal) ? 700 : 500,
                    color: goals.includes(goal)
                      ? "var(--primary)"
                      : "var(--text-secondary)",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={goals.includes(goal)}
                    onChange={() => handleGoalToggle(goal)}
                    aria-checked={goals.includes(goal)}
                    style={{
                      marginRight: 7,
                      accentColor: "var(--primary)",
                    }}
                  />
                  <span>{goal}</span>
                </label>
              ))}
            </form>
          </div>
        )}
      </section>
      {/* Step description / progress indication */}
      <div
        style={{
          color: "var(--secondary)",
          fontSize: "1em",
          textAlign: "center",
          minHeight: "1.25em",
          marginBottom: 16,
          marginTop: -8,
        }}
        aria-live="polite"
      >
        {steps[stepIndex].description}
      </div>
      {/* Navigation Buttons */}
      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "space-between",
          marginTop: 18,
        }}
      >
        <button
          type="button"
          className="btn"
          onClick={handleBack}
          disabled={stepIndex === 0}
          style={{
            opacity: stepIndex === 0 ? 0.5 : 1,
            background: "linear-gradient(90deg,#343656 0,#26263d 90%)",
            color: "var(--primary)",
            border: "1.5px solid var(--accent)",
            fontWeight: 600,
          }}
        >
          Back
        </button>
        <button
          type="button"
          className={`btn btn-large pulse-cyber`}
          style={{
            marginLeft: "auto",
            background: canContinue
              ? "linear-gradient(90deg, var(--primary),var(--secondary) 90%)"
              : "linear-gradient(90deg,var(--surface),#373545 95%)",
            color: "#191b28",
            fontWeight: 800,
            border: "none",
            opacity: canContinue ? 1 : 0.66,
            boxShadow: canContinue
              ? "0 0 12px 2px var(--primary)"
              : "0 0 4px 1px var(--border-color)",
            letterSpacing: "0.03em",
            pointerEvents: canContinue ? "auto" : "none",
          }}
          onClick={handleNext}
          disabled={!canContinue}
          aria-disabled={!canContinue}
        >
          {stepIndex < steps.length - 1 ? "Continue" : "Finish"}
        </button>
      </div>
      {/* Progress dots under stepper for extra visual feedback (mobile) */}
      <div
        aria-hidden="true"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 9,
          margin: "30px 0 0",
        }}
      >
        {steps.map((_, idx) => (
          <div
            key={idx}
            style={{
              width: 13,
              height: 13,
              borderRadius: "40%",
              background:
                idx === stepIndex
                  ? "var(--primary)"
                  : idx < stepIndex
                  ? "var(--accent)"
                  : "var(--surface)",
              opacity: idx === stepIndex ? 0.99 : 0.55,
              border:
                idx === stepIndex
                  ? "2.2px solid var(--secondary)"
                  : idx < stepIndex
                  ? "1.6px solid var(--primary)"
                  : "1.3px solid var(--border-color)",
              boxShadow:
                idx === stepIndex
                  ? "0 0 11px 2px var(--secondary)"
                  : idx < stepIndex
                  ? "0 0 3px 1px var(--accent)"
                  : "none",
              transition: "all 0.18s",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default Onboarding;
