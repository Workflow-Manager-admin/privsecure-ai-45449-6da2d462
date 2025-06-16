import React from "react";
import Sidebar from "./Sidebar";
import "../App.css";
import { Outlet } from "react-router-dom";

/**
 * PUBLIC_INTERFACE
 * MainLayout: Responsive grid layout with sidebar and main area for routed content
 * Uses theme variables for dark/cyber look. Adapts for mobile.
 */
function MainLayout() {
  return (
    <div className="ps-mainlayout">
      <Sidebar />
      <main className="ps-mainlayout-content">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
