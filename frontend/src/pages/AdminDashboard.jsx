import Header from "../components/Header";

export default function AdminDashboard({ darkMode, setDarkMode }) {
  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} min-h-screen`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          Admin Analytics Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <p className="text-sm">Total Interviews</p>
            <p className="text-3xl font-bold text-indigo-600">124</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <p className="text-sm">Average Confidence</p>
            <p className="text-3xl font-bold text-green-600">76%</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <p className="text-sm">Active Users</p>
            <p className="text-3xl font-bold text-purple-600">32</p>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          * Admin analytics can be extended with database integration.
        </p>
      </div>
    </div>
  );
}
