import React from "react";
import { NavLink } from "react-router-dom";
import "../App.css";

/**
 * PUBLIC_INTERFACE
 * Sidebar navigation for PrivSecure AI
 * Persistent, cyber-style nav for all major feature pages.
 */
const navLinks = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/ai-action-plan", label: "AI Action Plan" },
  { path: "/digital-twin", label: "Digital Twin Scanner" },
  { path: "/third-party-apps", label: "Third-Party App Risk" },
  { path: "/dark-web-leaks", label: "Dark Web Leak Monitor" },
  { path: "/social-graph", label: "Social Graph Risk Map" },
  { path: "/disintegration", label: "Data Disintegration" },
  { path: "/badges", label: "Badge System" },
  { path: "/settings", label: "Settings & Reports" },
  { path: "/about", label: "About" },
];
// No Privacy Manifesto link present in navigation.

function Sidebar() {
  return (
    <aside className="ps-sidebar">
      <div className="ps-sidebar-header">
        <span className="logo-symbol">⎓</span>
        <span className="ps-sidebar-title">PrivSecure AI</span>
      </div>
      <nav className="ps-sidebar-nav">
        <ul>
          {navLinks.map(({ path, label }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  "ps-sidebar-link" + (isActive ? " active" : "")
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
