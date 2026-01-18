import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Header({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const role = localStorage.getItem("role") || "user";

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const navItem = (path, label) => {
    const active = location.pathname === path;
    return (
      <button
        onClick={() => navigate(path)}
        className={`relative px-3 py-1 text-sm font-medium transition ${
          active
            ? "text-indigo-500"
            : "text-slate-500 hover:text-indigo-500"
        }`}
      >
        {label}
        {active && (
          <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-indigo-500 rounded-full" />
        )}
      </button>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-3 flex items-center justify-between">
      {/* LEFT */}
      <div
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 cursor-pointer"
      >
        <div className="h-9 w-9 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold shadow">
          F
        </div>
        <span className="font-semibold text-lg">FaceSense-AI</span>
      </div>

      {/* CENTER NAV */}
      <nav className="hidden md:flex gap-6">
        {navItem("/dashboard", "Dashboard")}
        {navItem("/feedback", "Final Report")}
        {role === "admin" && navItem("/admin", "Admin")}
      </nav>

      {/* RIGHT */}
      <div className="flex items-center gap-4 relative">
        {/* AI STATUS */}
        <div className="flex items-center gap-2 text-sm">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="hidden sm:block text-slate-500 dark:text-slate-300">
            AI Active
          </span>
        </div>

        {/* DARK MODE */}
        <button
          onClick={() => setDarkMode(v => !v)}
          className="px-3 py-1 rounded-md bg-slate-900 dark:bg-slate-700 text-white text-sm hover:scale-105 transition"
        >
          {darkMode ? "Light" : "Dark"}
        </button>

        {/* PROFILE */}
        <div
          onClick={() => setOpen(v => !v)}
          className="h-9 w-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold cursor-pointer hover:scale-105 transition"
        >
          U
        </div>

        {open && (
          <div className="absolute right-0 top-12 w-44 bg-white dark:bg-slate-700 border dark:border-slate-600 rounded-xl shadow-xl overflow-hidden text-sm">
            <button
              onClick={() => navigate("/profile")}
              className="block w-full text-left px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-600"
            >
              Profile
            </button>
            <button
              onClick={logout}
              className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
