import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <div
      onClick={() => setDark(!dark)}
      className="
        w-14 h-7 flex items-center
        bg-gray-300 dark:bg-indigo-600
        rounded-full p-1 cursor-pointer
        transition-colors duration-300
      "
    >
      <div
        className={`
          bg-white w-5 h-5 rounded-full shadow-md
          transform transition-transform duration-300
          ${dark ? "translate-x-7" : ""}
        `}
      />
    </div>
  );
}
