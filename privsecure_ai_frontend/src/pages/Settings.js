import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * Settings: Configuration page for PrivSecure AI.
 * Features:
 * 1. Device sync status display (mock/demo)
 * 2. Download report as PDF (dummy handler)
 * 3. AI privacy behavior toggle (mock/demo)
 * Clean, modern layout with full theming, spacing, and accessibility.
 */
function Settings() {
  // Demo/mock state for device sync and privacy toggle
  const [aiPrivacyEnabled, setAiPrivacyEnabled] = useState(true);
  // Mock sync status
  const deviceSyncStatus = {
    lastSync: "2024-05-21 09:45am",
    status: "Synced",
    deviceName: "Alice’s iPhone 14",
    strength: "Excellent",
  };

  // Dummy download handler
  const handleDownloadPDF = () => {
    // Simulate PDF by triggering a dummy blob download
    const pdfBlob = new Blob(
      [
        "This is a mock Privacy Report for PrivSecure AI.\n\n[No real sensitive data included.]\n\nReport Date: " +
          new Date().toLocaleString(),
      ],
      { type: "application/pdf" }
    );
    const link = document.createElement("a");
    link.href = URL.createObjectURL(pdfBlob);
    link.download = "privacy-report-demo.pdf";
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }, 500);
  };

  // Toggle privacy behavior
  const handleAiPrivacyToggle = () => setAiPrivacyEnabled((x) => !x);

  return (
    <div className="container" style={{ maxWidth: 560, marginTop: 42 }}>
      <div
        className="page-main-surface"
        style={{
          background: "var(--surface)",
          boxShadow: "var(--box-shadow)",
          borderRadius: "var(--border-radius)",
        }}
        aria-label="Settings main section"
      >
        <h1 className="title page-title" style={{ margin: 0, fontSize: "2.09rem" }}>
          Settings
        </h1>

        {/* Device Sync Status */}
        <section
          className="card"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginBottom: 18,
          }}
          aria-label="Device Sync Status"
        >
          <div className="widget-title" style={{ marginBottom: 4 }}>Device Sync Status</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span
              style={{
                display: "inline-block",
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: deviceSyncStatus.status === "Synced" ? "linear-gradient(125deg,#13B9B9,#055C5C 87%)" : "#E87A41",
                boxShadow: "0 0 7px 1.5px var(--accent)",
                marginRight: 3,
              }}
              aria-label="Sync status indicator"
            ></span>
            <span style={{ fontWeight: 600, color: "var(--primary)", fontFamily: "Montserrat,sans-serif" }}>
              {deviceSyncStatus.status}
            </span>
            <span style={{ color: "var(--text-secondary)", marginLeft: "auto", fontSize: ".98em" }}>
              Last sync: {deviceSyncStatus.lastSync}
            </span>
          </div>
          <div
            style={{
              color: "var(--text-secondary)",
              fontSize: "1em",
              letterSpacing: ".01em",
              marginLeft: 8,
              marginBottom: 0,
            }}
          >
            Device:{" "}
            <span style={{ color: "var(--primary)", fontWeight: 500 }}>
              {deviceSyncStatus.deviceName}
            </span>
            <span style={{ marginLeft: 13, fontStyle: "italic", color: "#13B9B9", fontWeight: 500 }}>
              Strength: {deviceSyncStatus.strength}
            </span>
          </div>
        </section>

        {/* Report Download (PDF) */}
        <section
          className="card"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 11,
            marginBottom: 18,
          }}
          aria-label="Download Privacy Report"
        >
          <div className="widget-title" style={{ marginBottom: 3 }}>
            Download Report
          </div>
          <div style={{ color: "var(--text-secondary)", fontSize: "1.08em", marginBottom: 5 }}>
            Generate and download a summary of your privacy & sync activity. <span style={{ color: "#E87A41", fontWeight: 500, fontSize: "0.97em" }}>(Demo report)</span>
          </div>
          <button
            className="btn btn-large"
            onClick={handleDownloadPDF}
            type="button"
            aria-label="Download Privacy Report as PDF"
            style={{
              fontWeight: 700,
              background: "linear-gradient(90deg, var(--primary), var(--secondary) 85%)",
              boxShadow: "0 0 14px -2px var(--primary), 0 2px 18px 0 var(--accent)",
              color: "#fff",
              marginTop: 3,
              fontSize: "1.09rem",
              border: "none",
              borderRadius: "var(--border-radius)",
              padding: "12px 36px",
              letterSpacing: ".04em",
            }}
          >
            <span role="img" aria-label="PDF icon" style={{ marginRight: 8 }}>
              📄
            </span>
            Download PDF Report
          </button>
        </section>

        {/* AI Privacy Behavior Toggle */}
        <section
          className="card"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 11,
          }}
          aria-label="AI Privacy Behavior"
        >
          <div className="widget-title" style={{ marginBottom: 3 }}>
            AI Privacy Behavior
          </div>
          <div style={{ color: "var(--text-secondary)", fontSize: "1.05em", marginBottom: 4 }}>
            Control how PrivSecure AI interacts with your private data.<br />
            <span style={{ color: "#E87A41", fontWeight: 500, fontSize: "0.97em" }}>(Demo only: toggle does not affect system behavior)</span>
          </div>
          <label
            htmlFor="ai-privacy-toggle"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginTop: 4,
              marginLeft: 1,
              fontSize: "1.025em",
              fontWeight: 600,
              color: "var(--primary)",
              letterSpacing: ".01em",
              cursor: "pointer",
              fontFamily: "Montserrat,Arial,sans-serif",
              userSelect: "none",
            }}
          >
            <span
              style={{
                marginRight: 8,
                color: aiPrivacyEnabled ? "#13B9B9" : "#e07024",
                fontWeight: 700,
                textShadow: aiPrivacyEnabled ? "0 0 5px var(--accent)" : "0 0 7px #E87A41",
              }}
            >
              {aiPrivacyEnabled ? "Enabled" : "Disabled"}
            </span>
            {/* Custom toggle switch */}
            <span
              role="switch"
              aria-checked={aiPrivacyEnabled}
              tabIndex={0}
              onClick={handleAiPrivacyToggle}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleAiPrivacyToggle();
              }}
              style={{
                width: 47,
                height: 27,
                background: aiPrivacyEnabled ? "linear-gradient(92deg,#13B9B9,#055C5C 85%)" : "#d3d4d7",
                borderRadius: 18,
                border: aiPrivacyEnabled
                  ? "1.6px solid #13B9B9"
                  : "1.2px solid #bbb",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: aiPrivacyEnabled ? "flex-end" : "flex-start",
                cursor: "pointer",
                outline: "none",
                boxShadow: aiPrivacyEnabled
                  ? "0 0 7px 2px #0ff8"
                  : "0 0 5px 1.5px #bbb8",
                transition:
                  "background 0.22s, border 0.13s, box-shadow 0.17s, justify-content 0.18s",
                position: "relative",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: aiPrivacyEnabled
                    ? "linear-gradient(90deg, #13B9B9 70%, #055C5C 100%)"
                    : "#eee",
                  border: "1.5px solid #fff",
                  margin: "0 3px",
                  boxShadow: aiPrivacyEnabled
                    ? "0 0 9px 1.5px var(--accent)"
                    : "0 0 4px 1px #ccc",
                  transition: "background 0.16s, box-shadow 0.18s",
                }}
              ></span>
            </span>
          </label>
        </section>
      </div>
    </div>
  );
}

export default Settings;
