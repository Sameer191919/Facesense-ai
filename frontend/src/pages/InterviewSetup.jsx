import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function InterviewSetup() {
  const navigate = useNavigate();

  const [type, setType] = useState("hr");
  const [duration, setDuration] = useState(5);
  const [technology, setTechnology] = useState("python");

  const startInterview = () => {
    navigate(
      `/interview?type=${type}&duration=${duration}&tech=${technology}`
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Mock Interview Setup
        </h2>

        {/* Interview Type */}
        <label className="block mb-2 font-medium">Interview Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
        >
          <option value="hr">HR Interview</option>
          <option value="technical">Technical Interview</option>
        </select>

        {/* Technology */}
        {type === "technical" && (
          <>
            <label className="block mb-2 font-medium">Technology</label>
            <select
              value={technology}
              onChange={(e) => setTechnology(e.target.value)}
              className="w-full border p-2 mb-4 rounded"
            >
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="javascript">JavaScript</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
            </select>
          </>
        )}

        {/* Duration */}
        <label className="block mb-2 font-medium">
          Duration (minutes)
        </label>
        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full border p-2 mb-6 rounded"
        >
          <option value={5}>5 Minutes</option>
          <option value={10}>10 Minutes</option>
          <option value={15}>15 Minutes</option>
        </select>

        <button
          onClick={startInterview}
          className="bg-indigo-600 text-white w-full py-2 rounded"
        >
          Start Interview
        </button>
      </div>
    </div>
  );
}
