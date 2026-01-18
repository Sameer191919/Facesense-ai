import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const TECHS = ["python", "java", "javascript", "c", "cpp"];
const DIFFICULTIES = ["beginner", "intermediate", "advanced"];

const inputClass =
  "w-full p-2 rounded border bg-white text-gray-900 " +
  "dark:bg-slate-900 dark:text-slate-100 dark:border-slate-600";

export default function Dashboard() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  /* ---------------- SELECTIONS ---------------- */
  const [tech, setTech] = useState("python");
  const [difficulty, setDifficulty] = useState("beginner");
  const [duration, setDuration] = useState(10);

  /* ---------------- HISTORY ---------------- */
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("interview_history")) || [];
    setHistory(stored);
  }, []);

  /* ---------------- START INTERVIEWS ---------------- */
  const startHR = () => {
    navigate(`/interview?type=hr&duration=${duration}`);
  };

  const startTechnical = () => {
    navigate(
      `/interview?type=technical&technology=${tech}&difficulty=${difficulty}&duration=${duration}`
    );
  };

  /* ---------------- ANALYTICS ---------------- */
  const totalInterviews = history.length;
  const avgScore =
    history.length === 0
      ? 0
      : Math.round(
          history.reduce((a, b) => a + b.score, 0) / history.length
        );

  const bestTech =
    history.length === 0
      ? "N/A"
      : history.reduce((acc, cur) =>
          cur.score > acc.score ? cur : acc
        ).tech;

  const techStats = TECHS.map(t => {
    const items = history.filter(h => h.tech === t);
    const avg =
      items.length === 0
        ? 0
        : Math.round(items.reduce((a, b) => a + b.score, 0) / items.length);
    return { tech: t, avg };
  });

  return (
    <div
      className={`${
        darkMode ? "bg-slate-900 text-slate-100" : "bg-slate-100 text-slate-900"
      } min-h-screen`}
    >
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="p-6 space-y-10 max-w-7xl mx-auto">

        {/* ================= SUMMARY CARDS ================= */}
        <div className="grid md:grid-cols-4 gap-6">
          <SummaryCard
            title="Total Interviews"
            value={totalInterviews}
            gradient="from-indigo-500 to-purple-600"
          />
          <SummaryCard
            title="Average Score"
            value={`${avgScore}%`}
            gradient="from-green-500 to-emerald-600"
          />
          <SummaryCard
            title="Best Technology"
            value={bestTech.toUpperCase()}
            gradient="from-orange-500 to-pink-600"
          />
          <SummaryCard
            title="Confidence Trend"
            value={avgScore >= 70 ? "Positive" : "Needs Work"}
            gradient="from-sky-500 to-cyan-600"
          />
        </div>

        {/* ================= ANALYTICS ================= */}
        <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-semibold mb-6">
            Performance Analytics (by Technology)
          </h2>

          {techStats.map(stat => (
            <div key={stat.tech} className="mb-4">
              <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mb-1">
                <span className="capitalize">{stat.tech}</span>
                <span>{stat.avg}%</span>
              </div>

              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded h-2 overflow-hidden">
                <div
                  className="h-2 rounded transition-all duration-700 bg-gradient-to-r from-indigo-500 to-purple-600"
                  style={{ width: `${stat.avg}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ================= INTERVIEW SETUP ================= */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* HR */}
          <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold mb-4">HR Interview</h3>

            <label className="block text-sm mb-1">Duration (minutes)</label>
            <select
              value={duration}
              onChange={e => setDuration(Number(e.target.value))}
              className={`${inputClass} mb-4`}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>

            <PrimaryButton onClick={startHR}>
              Start HR Interview
            </PrimaryButton>
          </div>

          {/* TECHNICAL */}
          <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold mb-4">Technical Interview</h3>

            <label className="block text-sm mb-1">Technology</label>
            <select
              value={tech}
              onChange={e => setTech(e.target.value)}
              className={`${inputClass} mb-3`}
            >
              {TECHS.map(t => (
                <option key={t} value={t}>
                  {t.toUpperCase()}
                </option>
              ))}
            </select>

            <label className="block text-sm mb-1">Difficulty</label>
            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
              className={`${inputClass} mb-3`}
            >
              {DIFFICULTIES.map(d => (
                <option key={d} value={d}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </option>
              ))}
            </select>

            <label className="block text-sm mb-1">Duration (minutes)</label>
            <select
              value={duration}
              onChange={e => setDuration(Number(e.target.value))}
              className={`${inputClass} mb-4`}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>

            <SecondaryButton onClick={startTechnical}>
              Start Technical Interview
            </SecondaryButton>
          </div>
        </div>

        {/* ================= HISTORY ================= */}
        <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Interview History</h2>

          {history.length === 0 ? (
            <p className="text-sm text-slate-500">
              No interviews completed yet.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-300 dark:border-slate-600">
                  <th className="py-2 text-left">Technology</th>
                  <th className="text-left">Difficulty</th>
                  <th className="text-left">Score</th>
                  <th className="text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-2 capitalize">{h.tech}</td>
                    <td className="capitalize">{h.difficulty}</td>
                    <td>{h.score}%</td>
                    <td>{h.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function SummaryCard({ title, value, gradient }) {
  return (
    <div
      className={`rounded-2xl p-5 text-white shadow-lg bg-gradient-to-r ${gradient} transform transition hover:scale-105`}
    >
      <p className="text-sm opacity-90">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}

function PrimaryButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition transform hover:scale-105 active:scale-95"
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-3 rounded-lg bg-slate-900 hover:bg-black text-white font-medium transition transform hover:scale-105 active:scale-95"
    >
      {children}
    </button>
  );
}
