import React, { useState, useCallback } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
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
  Settings,
  Login,
  Onboarding,
} from "./pages";

// PUBLIC_INTERFACE
// App: Main entry point—sets up routing, layout, auth state, and feature rendering for PrivSecure AI.

/**
 * Basic ProtectedRoute helper that redirects to /login or /onboarding if not authenticated.
 * @param {object} props
 * @param {JSX.Element} props.children
 * @param {boolean} props.isAuthenticated
 * @param {boolean} props.isOnboarded
 * @returns
 */
function ProtectedRoute({ children, isAuthenticated, isOnboarded }) {
  const location = useLocation();

  if (!isAuthenticated) {
    // If not authenticated, always route to login page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (!isOnboarded && location.pathname !== "/onboarding") {
    // If onboarding not complete, route to onboarding page.
    return <Navigate to="/onboarding" state={{ from: location }} replace />;
  }
  return children;
}

function App() {
  // Stub: minimal "authentication" simulation
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);

  // Simulate login
  const handleLogin = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  // Simulate onboarding completion
  const handleOnboardingFinish = useCallback(() => {
    setIsOnboarded(true);
  }, []);

  // If not authenticated, only show /login route (and fallback to it)
  // If authenticated but not onboarded, allow only /onboarding and fallback to it
  // Else, allow main app routes

  return (
    <BrowserRouter>
      <Routes>
        {/* If not authenticated, show login page only */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={isOnboarded ? "/dashboard" : "/onboarding"} replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        {/* If authenticated but not onboarded, force onboarding */}
        <Route
          path="/onboarding"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : isOnboarded ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Onboarding onFinish={handleOnboardingFinish} />
            )
          }
        />

        {/* All protected routes inside the MainLayout */}
        <Route
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              isOnboarded={isOnboarded}
            >
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ai-action-plan" element={<ActionPlan />} />
          <Route path="/digital-twin" element={<DigitalTwin />} />
          <Route path="/third-party-apps" element={<ThirdPartyApps />} />
          <Route path="/dark-web-leaks" element={<DarkWebLeaks />} />
          <Route path="/social-graph" element={<SocialGraph />} />
          <Route path="/disintegration" element={<Disintegration />} />
          <Route path="/badges" element={<Badges />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        {/* Fallback: redirect to appropriate page */}
        <Route
          path="*"
          element={
            isAuthenticated
              ? isOnboarded
                ? <Navigate to="/dashboard" replace />
                : <Navigate to="/onboarding" replace />
              : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;