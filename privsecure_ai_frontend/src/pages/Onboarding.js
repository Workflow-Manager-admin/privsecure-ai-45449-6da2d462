import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * Onboarding wizard for EchoGuard
 * Three steps: permissions, device sync, goal selection.
 */
function Onboarding({ onFinish }) {
  const [step, setStep] = useState(1);

  const handleNext = () => setStep((prev) => prev + 1);
  const handleFinish = () => {
    onFinish && onFinish();
  };

  return (
    <div className="container" style={{
      maxWidth: 500, marginTop: 44, background: "var(--surface)", borderRadius: "var(--border-radius)",
      boxShadow: "var(--box-shadow)", padding: "44px 30px 35px", color: "var(--text-primary)"
    }}>
      <h1 className="title" style={{
        color: "var(--primary)", fontWeight: 900, fontSize: "2.04rem", marginBottom: 12,
        textShadow: "0 0 18px var(--secondary), 0 0 2px var(--primary)", letterSpacing: ".05em"
      }}>
        Welcome to EchoGuard
      </h1>
      <div className="subtitle" style={{
        color: "var(--accent)", fontWeight: 600, fontSize: "1.09rem", marginBottom: 18
      }}>
        Your cybersecurity journey starts now. Let's personalize your experience!
      </div>

      <div style={{ margin: "40px 0 20px 0" }}>
        {step === 1 && (
          <div>
            <strong>Step 1:</strong> Grant permissions so EchoGuard can analyze your privacy risk.
          </div>
        )}
        {step === 2 && (
          <div>
            <strong>Step 2:</strong> Sync devices for full monitoring and real-time alerts.
          </div>
        )}
        {step === 3 && (
          <div>
            <strong>Step 3:</strong> Pick your privacy goals and customize AI recommendations.
          </div>
        )}
      </div>

      <div style={{ marginTop: 35, display: "flex", justifyContent: "space-between" }}>
        {step < 3 ? (
          <button className="btn btn-large" onClick={handleNext} style={{ minWidth: 148 }}>
            Next
          </button>
        ) : (
          <button className="btn btn-large" onClick={handleFinish} style={{ minWidth: 148 }}>
            Finish
          </button>
        )}
      </div>
      <div style={{ marginTop: 24, opacity: 0.80, fontSize: ".98em" }}>
        Step {step} of 3
      </div>
    </div>
  );
}

export default Onboarding;
