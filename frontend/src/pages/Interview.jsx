import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

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

  const type = params.get("type") || "hr";
  const tech = params.get("technology") || "hr";
  const duration = Number(params.get("duration")) || 10;

  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  const [micOn, setMicOn] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);

  const [emotion, setEmotion] = useState("neutral");
  const [confidence, setConfidence] = useState(75);
  const [emotionHistory, setEmotionHistory] = useState([]);
  const [transcript, setTranscript] = useState("");

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);

  /* AUTH CHECK */
  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/");
  }, [navigate]);

  /* LOAD QUESTIONS */
  useEffect(() => {
    api.get("/interview/questions", {
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
      .catch(() => {
        setQuestions([
          "Tell me about yourself.",
          "What are your strengths?",
          "Why should we hire you?"
        ]);
        setLoading(false);
      });
  }, [type, tech, duration]);

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

    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => {});
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
    if (!recognitionRef.current) return;
    micOn ? recognitionRef.current.stop() : recognitionRef.current.start();
    setMicOn(!micOn);
  };

  /* EMOTION SIMULATION LOGIC (SMARTER) */
  useEffect(() => {
    const interval = setInterval(() => {
      const emotions = Object.keys(EMOTION_SCORE);
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      setEmotion(randomEmotion);

      let score = EMOTION_SCORE[randomEmotion];

      // Adaptive logic
      if (randomEmotion === "happy") score += 5;
      if (randomEmotion === "sad" || randomEmotion === "angry") score -= 5;
      if (!micOn) score -= 2;

      score = Math.max(0, Math.min(100, score));

      setConfidence(score);
      setEmotionHistory(prev => [...prev, score]);

    }, 4000);

    return () => clearInterval(interval);
  }, [micOn]);

  const finishInterview = () => {
    localStorage.setItem("latestInterview", JSON.stringify({
      confidence,
      emotionHistory,
      dominantEmotion: emotion,
      date: new Date().toLocaleString()
    }));

    navigate("/feedback");
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-blue-100 dark:bg-slate-900 text-slate-900 dark:text-white">
        Loading…
      </div>
    );
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((index + 1) / questions.length) * 100;

  return (
    <div className="
      min-h-screen p-6
      bg-gradient-to-br 
      from-blue-100 via-purple-100 to-pink-100
      dark:from-indigo-800 dark:via-purple-800 dark:to-pink-800
      text-slate-900 dark:text-white
      transition-colors duration-500
    ">

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* QUESTION PANEL */}
        <div className="
          md:col-span-2
          bg-white/80 dark:bg-white/10
          backdrop-blur-xl
          border border-slate-300 dark:border-white/20
          rounded-2xl p-6 shadow-xl
        ">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">
              Question {index + 1} / {questions.length}
            </h2>

            <div className="flex items-center gap-3">

              <span className={`
                px-4 py-1 rounded-full text-sm text-white
                ${timeLeft < 60 ? "bg-red-500 animate-pulse" : "bg-indigo-600"}
              `}>
                ⏱ {minutes}:{seconds.toString().padStart(2, "0")}
              </span>

              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to end the interview?")) {
                    finishInterview();
                  }
                }}
                className="px-3 py-1 text-sm rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
              >
                Exit
              </button>

            </div>
          </div>

          {/* PROGRESS BAR */}
          <div className="w-full bg-slate-300 dark:bg-white/20 rounded-full h-2 mb-4">
            <div
              className="h-2 rounded-full bg-indigo-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-xl font-bold mb-4">
            {questions[index]}
          </p>

          <div className="
            border border-slate-300 dark:border-white/20
            rounded-lg p-3 mb-4 min-h-[80px]
            bg-white dark:bg-white/10
          ">
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
                index + 1 < questions.length
                  ? setIndex(i => i + 1)
                  : finishInterview();
              }}
            >
              {index + 1 === questions.length ? "Finish" : "Next"}
            </ActionBtn>

          </div>

        </div>

        {/* AI PANEL */}
        <div className="
          bg-white/80 dark:bg-white/10
          backdrop-blur-xl
          border border-slate-300 dark:border-white/20
          rounded-2xl p-6 shadow-xl
        ">

          <div className="flex items-center gap-2 mb-3">
            <span className="h-3 w-3 rounded-full bg-green-500 animate-ping" />
            <span className="text-sm font-medium">AI ANALYZING</span>
          </div>

          {cameraOn && (
            <video
              ref={videoRef}
              autoPlay
              muted
              className="rounded mb-4 border border-slate-300 dark:border-white/20"
            />
          )}

          <p className="text-sm mb-1">
            Emotion: <b>{emotion}</b>
          </p>

          <div className="h-2 rounded bg-slate-300 dark:bg-white/20 overflow-hidden">
            <div
              className="h-full transition-all duration-700 bg-gradient-to-r from-green-400 to-emerald-600"
              style={{ width: `${confidence}%` }}
            />
          </div>

          <p className="mt-4 text-sm">Confidence</p>
          <p className="text-3xl font-bold">
            {confidence}%
          </p>

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
      className={`${base} ${colors[color]} ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
}
