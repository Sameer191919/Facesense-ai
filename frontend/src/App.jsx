import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Interview from "./pages/Interview";
import Feedback from "./pages/Feedback";
import AdminDashboard from "./pages/AdminDashboard";
import UserProfile from "./pages/UserProfile";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/dashboard"
        element={<Dashboard darkMode={darkMode} setDarkMode={setDarkMode} />}
      />
      <Route
        path="/interview"
        element={<Interview darkMode={darkMode} setDarkMode={setDarkMode} />}
      />
      <Route
        path="/feedback"
        element={<Feedback darkMode={darkMode} setDarkMode={setDarkMode} />}
      />
      <Route
        path="/profile"
        element={<UserProfile darkMode={darkMode} setDarkMode={setDarkMode} />}
      />
      <Route
        path="/admin"
        element={<AdminDashboard darkMode={darkMode} setDarkMode={setDarkMode} />}
      />
    </Routes>
  );
}
