import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function Topbar() {

  const { darkMode, setDarkMode } = useContext(ThemeContext);

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-900 shadow">
      
      <h1 className="text-xl font-bold text-gray-800 dark:text-white">
        FaceSense AI
      </h1>

      {/* Animated Toggle */}
      <div
        onClick={() => setDarkMode(!darkMode)}
        className="w-14 h-7 flex items-center bg-gray-300 dark:bg-indigo-600 rounded-full p-1 cursor-pointer transition"
      >
        <div
          className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ${
            darkMode ? "translate-x-7" : ""
          }`}
        ></div>
      </div>

    </div>
  );
}
