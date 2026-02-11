import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedButton from "../components/AnimatedButton";
export default function Dashboard() {

  const navigate = useNavigate();

  const [duration, setDuration] = useState(5);
  const [level, setLevel] = useState("Beginner");
  const [type, setType] = useState("HR");

  const [history, setHistory] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("interviewHistory")) || [];
    setHistory(stored);
  }, []);

  const totalInterviews = history.length;
  const averageScore =
    totalInterviews > 0
      ? Math.round(
          history.reduce((acc, cur) => acc + cur.confidence, 0) / totalInterviews
        )
      : 0;

  const bestPerformance =
    totalInterviews > 0
      ? history.reduce((prev, current) =>
          prev.confidence > current.confidence ? prev : current
        ).dominantEmotion
      : "N/A";

  const startInterview = () => {
    navigate(
      `/interview?type=${type}&duration=${duration}&level=${level}`
    );
  };

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-8">
        Welcome Back 👋
      </h1>

      {/* CONFIGURATION CARD */}
      <div
        className="
        bg-white/80 dark:bg-white/10
        backdrop-blur-xl
        border border-slate-300 dark:border-white/20
        p-8 rounded-2xl shadow-xl mb-10
        transition-colors duration-500
        "
      >

        <h2 className="text-xl font-semibold mb-6">
          Configure Your Interview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Interview Type */}
          <div>
            <label className="block mb-2 font-medium">
              Interview Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-white/10"
            >
              <option>HR</option>
              <option>Technical</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block mb-2 font-medium">
              Duration (Minutes)
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full p-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-white/10"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>

          {/* Level */}
          <div>
            <label className="block mb-2 font-medium">
              Difficulty Level
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full p-3 rounded-lg border border-slate-300 dark:border-white/20 bg-white dark:bg-white/10"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

        </div>

        
<AnimatedButton onClick={startInterview}>
  Start Interview 🚀
</AnimatedButton>

      </div>

      {/* STATS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div
          className="
          bg-white/80 dark:bg-white/10
          backdrop-blur-xl
          border border-slate-300 dark:border-white/20
          p-6 rounded-2xl shadow-xl
          "
        >
          <h3 className="text-lg font-semibold mb-2">
            Total Interviews
          </h3>
          <p className="text-3xl font-bold text-indigo-600">
            {totalInterviews}
          </p>
        </div>

        <div
          className="
          bg-white/80 dark:bg-white/10
          backdrop-blur-xl
          border border-slate-300 dark:border-white/20
          p-6 rounded-2xl shadow-xl
          "
        >
          <h3 className="text-lg font-semibold mb-2">
            Average Score
          </h3>
          <p className="text-3xl font-bold text-green-500">
            {averageScore}%
          </p>
        </div>

        <div
          className="
          bg-white/80 dark:bg-white/10
          backdrop-blur-xl
          border border-slate-300 dark:border-white/20
          p-6 rounded-2xl shadow-xl
          "
        >
          <h3 className="text-lg font-semibold mb-2">
            Best Emotion
          </h3>
          <p className="text-3xl font-bold text-yellow-500">
            {bestPerformance}
          </p>
        </div>

      </div>

    </div>
  );
}
