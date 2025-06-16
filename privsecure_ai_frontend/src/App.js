import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import {
  Dashboard,
  ActionPlan,
  DigitalTwin,
  ThirdPartyApps,
  DarkWebLeaks,
  SocialGraph,
  Disintegration,
  Badges,
  PrivacyManifesto,
  Settings,
} from "./pages";

// PUBLIC_INTERFACE
// App: Main entry point—sets up routing, layout, and feature rendering for PrivSecure AI.

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ai-action-plan" element={<ActionPlan />} />
          <Route path="/digital-twin" element={<DigitalTwin />} />
          <Route path="/third-party-apps" element={<ThirdPartyApps />} />
          <Route path="/dark-web-leaks" element={<DarkWebLeaks />} />
          <Route path="/social-graph" element={<SocialGraph />} />
          <Route path="/disintegration" element={<Disintegration />} />
          <Route path="/badges" element={<Badges />} />
          <Route path="/privacy-manifesto" element={<PrivacyManifesto />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        {/* Fallback: redirect unknown routes */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;