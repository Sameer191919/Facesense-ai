import Sidebar from "../components/Sidebar";

export default function MainLayout({ children }) {
  return (
    <div
      className="
      min-h-screen flex
      bg-gradient-to-br
      from-blue-100 via-purple-100 to-pink-100
      dark:from-indigo-800 dark:via-purple-800 dark:to-pink-800
      text-slate-900 dark:text-white
      transition-colors duration-500
      "
    >
      <Sidebar />

      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  );
}
