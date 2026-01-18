import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import api from "../services/api";

export default function Feedback() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  const [confidence, setConfidence] = useState(0);
  const [communication, setCommunication] = useState(0);

  /* ---------------- ANIMATE SCORES ---------------- */
  useEffect(() => {
    let c1 = 0;
    let c2 = 0;

    const t = setInterval(() => {
      if (c1 < 82) setConfidence(++c1);
      if (c2 < 78) setCommunication(++c2);
      if (c1 >= 82 && c2 >= 78) clearInterval(t);
    }, 20);

    return () => clearInterval(t);
  }, []);

  /* ---------------- DOWNLOAD PDF ---------------- */
  const downloadReport = async () => {
    const res = await api.post(
      "/interview/feedback",
      {
        candidate: "Demo Candidate",
        emotion_summary: "Confident",
        sentiment: "POSITIVE",
        answers_count: 5
      },
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = "FaceSense_AI_Report.pdf";
    a.click();
  };

  return (
    <div className={`${darkMode ? "bg-slate-900 text-slate-100" : "bg-slate-100 text-slate-900"} min-h-screen`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="flex items-center justify-center px-6 py-16">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-6">Interview Summary</h2>

          {/* SCORE CARDS */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <ScoreCard
              title="Confidence"
              value={confidence}
              gradient="from-indigo-500 to-purple-600"
            />
            <ScoreCard
              title="Communication"
              value={communication}
              gradient="from-green-500 to-emerald-600"
            />
          </div>

          {/* DOWNLOAD */}
          <button
            onClick={downloadReport}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:scale-105 transition shadow-lg"
          >
            📄 Download PDF Report
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 w-full py-2 rounded-lg bg-slate-800 hover:bg-black text-white transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- SCORE CARD ---------------- */
function ScoreCard({ title, value, gradient }) {
  return (
    <div className={`rounded-xl p-4 text-white shadow bg-gradient-to-r ${gradient}`}>
      <p className="text-sm opacity-90">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}%</p>
    </div>
  );
}
