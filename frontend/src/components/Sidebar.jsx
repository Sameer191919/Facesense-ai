import { NavLink } from "react-router-dom";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Sidebar() {

  const [collapsed, setCollapsed] = useState(false);

  const linkStyle = ({ isActive }) =>
    `
    flex items-center gap-3 px-4 py-3 rounded-lg transition
    ${isActive
      ? "bg-indigo-600 text-white"
      : "hover:bg-slate-200 dark:hover:bg-white/20"}
    `;

  return (
    <div
      className={`
        ${collapsed ? "w-20" : "w-64"}
        min-h-screen
        bg-white/80 dark:bg-white/10
        backdrop-blur-xl
        border-r border-slate-300 dark:border-white/20
        text-slate-900 dark:text-white
        p-6 shadow-2xl
        transition-all duration-300
        flex flex-col
      `}
    >

      {/* TOP SECTION */}
      <div className="flex justify-between items-center mb-8">
        {!collapsed && (
          <h2 className="text-xl font-bold">
            FaceSense
          </h2>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-sm px-2 py-1 bg-indigo-600 text-white rounded-md"
        >
          {collapsed ? ">" : "<"}
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className="flex flex-col gap-3 flex-1">

        <NavLink to="/dashboard" className={linkStyle}>
          <span>🏠</span>
          {!collapsed && "Dashboard"}
        </NavLink>

        <NavLink to="/interview" className={linkStyle}>
          <span>🎤</span>
          {!collapsed && "Interview"}
        </NavLink>

        <NavLink to="/profile" className={linkStyle}>
          <span>👤</span>
          {!collapsed && "Profile"}
        </NavLink>

        <NavLink to="/feedback" className={linkStyle}>
          <span>📊</span>
          {!collapsed && "Reports"}
        </NavLink>

      </nav>

      {/* BOTTOM SECTION */}
      {!collapsed && (
        <div className="mt-10 flex justify-between items-center">
          <span className="text-sm">Dark Mode</span>
          <ThemeToggle />
        </div>
      )}

    </div>
  );
}
