import React from "react";
import { ExposureScoreCard, WeeklyTrendGraph, RealTimeAlertsPanel } from "../widgets";

/**
 * PUBLIC_INTERFACE
 * Real-Time Digital Exposure Dashboard: Modular layout for at-a-glance privacy/risk.
 * Now includes: Exposure Score Card (radial chart), ready for visual/themed integration.
 */
function Dashboard() {
  return (
    <div>
      <h1 style={{
        color: "var(--primary)",
        textShadow: "0 0 20px var(--secondary), 0 0 2px var(--primary)",
        fontWeight: 900,
        fontSize: "2.38rem",
        letterSpacing: ".05em",
        marginBottom: "2.4rem"
      }}>
        Real-Time Digital Exposure Dashboard
      </h1>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "34px",
        alignItems: "flex-start"
      }}>
        <ExposureScoreCard />
        <WeeklyTrendGraph />
        <RealTimeAlertsPanel />
        {/* Other dashboard widgets: PrivacyTip will go here */}
      </div>
    </div>
  );
}

export default Dashboard;
