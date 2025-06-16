import React from "react";
import {
  ExposureScoreCard,
  WeeklyTrendGraph,
  RealTimeAlertsPanel,
  DailyPrivacyTipCard,
} from "../widgets";

/**
 * PUBLIC_INTERFACE
 * Real-Time Digital Exposure Dashboard: Responsive grid of core widgets
 * Layout: Cyber/dark theme, adapts from desktop grid to stacked mobile layout.
 */
function Dashboard() {
  return (
    <div>
      <h1
        style={{
          color: "var(--primary)",
          textShadow: "0 0 20px var(--secondary), 0 0 2px var(--primary)",
          fontWeight: 900,
          fontSize: "2.38rem",
          letterSpacing: ".05em",
          marginBottom: "2.4rem",
        }}
      >
        Real-Time Digital Exposure Dashboard
      </h1>
      <div
        className="dashboard-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(310px,1fr))",
          gap: "32px",
          alignItems: "stretch",
          marginBottom: 12,
          width: "100%",
          maxWidth: 1390,
          marginLeft: "auto",
          marginRight: "auto",
          // For extra theme shadow/endglow on big screens
          boxShadow:
            "0 0 24px 2px #0ff4b, 0 0 26px 2px #f0fa12 inset, 0 0 30px 1px #191a3c99",
        }}
      >
        <ExposureScoreCard />
        <WeeklyTrendGraph />
        <RealTimeAlertsPanel />
        <DailyPrivacyTipCard />
      </div>
      {/* Responsive grid hint for very small screens */}
      <style>
        {`
        @media (max-width: 1050px) {
          .dashboard-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 730px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
            gap: 18px;
            padding: 0 5vw;
          }
          .dashboard-grid > * {
            min-width: 0 !important;
            max-width: 99vw !important;
            margin-left: 0 !important;
          }
        }
        `}
      </style>
    </div>
  );
}

export default Dashboard;
