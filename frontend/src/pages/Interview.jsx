import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import Header from "../components/Header";

const EMOTION_SCORE = {
  happy: 90,
  neutral: 75,
  surprised: 70,
  sad: 55,
  angry: 40,
  fearful: 45,
  disgusted: 35,
  unknown: 50
};

export default function Interview() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  /* URL PARAMS */
  const type = params.get("type") || "hr";
  const tech = params.get("technology") || "hr";
  const difficulty = params.get("difficulty") || "n/a";
  const duration = Number(params.get("duration")) || 10;

  /* STATE */
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  const [aiMonitoring, setAiMonitoring] = useState(true);
  const [micOn, setMicOn] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const [emotion, setEmotion] = useState("neutral");
  const [confidence, setConfidence] = useState(75);
  const [prevConfidence, setPrevConfidence] = useState(75); // ✅ FIX

  const [transcript, setTranscript] = useState("");

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);

  /* AUTH */
  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/");
  }, [navigate]);

  /* LOAD QUESTIONS */
  useEffect(() => {
    api
      .get("/interview/questions", {
        params: {
          interview_type: type,
          duration,
          technology: type === "technical" ? tech : undefined
        }
      })
      .then(res => {
        setQuestions(res.data.questions || []);
        setLoading(false);
      })
      .catch(() => navigate("/dashboard"));
  }, [type, tech, duration, navigate]);

  /* TIMER */
  useEffect(() => {
    if (timeLeft <= 0) finishInterview();
    const t = setInterval(() => setTimeLeft(v => v - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  /* CAMERA */
  useEffect(() => {
    if (!cameraOn) {
      streamRef.current?.getTracks().forEach(t => t.stop());
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    });
  }, [cameraOn]);

  /* SPEECH */
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const recog = new SR();
    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = "en-US";

    recog.onresult = e => {
      let text = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
      }
      setTranscript(text);
    };

    recognitionRef.current = recog;
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) return; // ✅ SAFETY
    micOn ? recognitionRef.current.stop() : recognitionRef.current.start();
    setMicOn(!micOn);
  };

  /* EMOTION */
  const captureEmotion = async () => {
    if (!aiMonitoring || !cameraOn || !videoRef.current) return;

    const v = videoRef.current;
    if (!v.videoWidth) return;

    const c = document.createElement("canvas");
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    c.getContext("2d").drawImage(v, 0, 0);

    c.toBlob(async blob => {
      try {
        const fd = new FormData();
        fd.append("image", blob);
        const res = await api.post("/interview/emotion", fd);

        const emo = res.data.emotion || "unknown";
        setPrevConfidence(confidence); // ✅ TRACK PREVIOUS
        setEmotion(emo);
        setConfidence(EMOTION_SCORE[emo] || 60);
      } catch {}
    }, "image/jpeg");
  };

  useEffect(() => {
    const i = setInterval(captureEmotion, 2000);
    return () => clearInterval(i);
  }, [aiMonitoring, cameraOn]);

  /* FINISH */
  const finishInterview = () => {
    const history = JSON.parse(localStorage.getItem("interview_history")) || [];

    const summary =
      confidence >= 80
        ? "Excellent confidence and emotional stability."
        : confidence >= 60
        ? "Good performance with moderate confidence."
        : "Needs improvement in confidence and communication.";

    history.push({
      type,
      tech: type === "technical" ? tech : "hr",
      difficulty,
      score: confidence,
      summary,
      date: new Date().toLocaleDateString()
    });

    localStorage.setItem("interview_history", JSON.stringify(history));
    alert(`Interview Completed!\n\nAI Summary:\n${summary}`);
    navigate("/feedback");
  };

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading…</div>;
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className={`${darkMode ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-900"} min-h-screen`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-6">
        {/* QUESTION */}
        <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">
              Question {index + 1} / {questions.length}
            </h2>
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm">
              ⏱ {minutes}:{seconds.toString().padStart(2, "0")}
            </span>
          </div>

          <p className="text-xl font-bold mb-4">{questions[index]}</p>

          <div className="border rounded-lg p-3 mb-4 min-h-[80px]">
            {transcript || "Speak your answer..."}
          </div>

          <div className="flex gap-3 flex-wrap">
            <ActionBtn color="green" onClick={toggleMic}>
              🎙 {micOn ? "Stop Mic" : "Start Mic"}
            </ActionBtn>

            <ActionBtn color="slate" onClick={() => setCameraOn(v => !v)}>
              📷 {cameraOn ? "Camera Off" : "Camera On"}
            </ActionBtn>

            <ActionBtn color="indigo" onClick={() => setSubmitted(true)}>
              Submit
            </ActionBtn>

            <ActionBtn
              disabled={!submitted}
              onClick={() => {
                setSubmitted(false);
                setTranscript("");
                index + 1 < questions.length ? setIndex(i => i + 1) : finishInterview();
              }}
            >
              {index + 1 === questions.length ? "Finish" : "Next"}
            </ActionBtn>
          </div>

          {/* PROGRESS INTELLIGENCE */}
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>
                {confidence > prevConfidence
                  ? "📈 Improving"
                  : confidence < prevConfidence
                  ? "📉 Dropping"
                  : "➖ Stable"}
              </span>
            </div>
          </div>
        </div>

        {/* AI PANEL */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-3 w-3 rounded-full bg-green-500 animate-ping" />
            <span className="text-sm font-medium">AI ANALYZING</span>
          </div>

          {cameraOn && <video ref={videoRef} autoPlay muted className="rounded mb-4" />}

          <p className="text-sm mb-1">Emotion: <b>{emotion}</b></p>
          <div className="h-2 rounded bg-slate-700 overflow-hidden">
            <div
              className="h-full transition-all duration-700 bg-gradient-to-r from-green-400 to-emerald-600"
              style={{ width: `${EMOTION_SCORE[emotion]}%` }}
            />
          </div>

          <p className="mt-4 text-sm">Confidence</p>
          <p className="text-3xl font-bold text-indigo-500">{confidence}%</p>
        </div>
      </div>
    </div>
  );
}

function ActionBtn({ children, onClick, disabled, color = "black" }) {
  const base =
    "px-4 py-2 rounded-lg text-white font-medium transition transform hover:scale-105 active:scale-95";

  const colors = {
    green: "bg-green-600 hover:bg-green-700",
    indigo: "bg-indigo-600 hover:bg-indigo-700",
    slate: "bg-slate-700 hover:bg-slate-800",
    black: "bg-black hover:bg-gray-900"
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${colors[color]} ${disabled && "opacity-40 cursor-not-allowed"}`}
    >
      {children}
    </button>
  );
}
