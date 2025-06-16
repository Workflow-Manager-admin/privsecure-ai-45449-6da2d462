import React from "react";

// PUBLIC_INTERFACE
// Minimal stub Onboarding page for setup flow.
function Onboarding({ onFinish }) {
  return (
    <div style={{ maxWidth: 400, margin: "100px auto", textAlign: "center" }}>
      <h1>Onboarding</h1>
      <p>This is a placeholder Onboarding page.<br />You can simulate onboarding here.</p>
      <button className="btn" onClick={onFinish} style={{ marginTop: 24 }}>
        Complete Onboarding
      </button>
    </div>
  );
}

export default Onboarding;
