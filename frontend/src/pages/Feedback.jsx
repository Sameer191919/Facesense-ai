import { useEffect, useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function Feedback() {

  const [data, setData] = useState(null);
  const reportRef = useRef();

  useEffect(() => {
    const latest = JSON.parse(localStorage.getItem("latestInterview"));
    const history = JSON.parse(localStorage.getItem("interviewHistory")) || [];

    if (latest) {
      history.push(latest);
      localStorage.setItem("interviewHistory", JSON.stringify(history));
    }

    setData(latest);
  }, []);

  if (!data) return <div className="p-10">No Interview Data Found</div>;

  const chartData = {
    labels: data.emotionHistory.map((_, i) => `Q${i + 1}`),
    datasets: [
      {
        label: "Confidence Trend",
        data: data.emotionHistory,
        borderColor: "#6366f1",
        backgroundColor: "#6366f1",
        tension: 0.4
      }
    ]
  };

  const summary =
    data.confidence >= 80
      ? "Excellent confidence and emotional control."
      : data.confidence >= 60
      ? "Good performance. Keep improving consistency."
      : "Confidence needs improvement. Practice more."

  const downloadPDF = async () => {
    const canvas = await html2canvas(reportRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    pdf.save("Interview_Report.pdf");
  };

  const history = JSON.parse(localStorage.getItem("interviewHistory")) || [];

  return (
    <div className="min-h-screen p-8 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">

      <div ref={reportRef}>

        <h1 className="text-3xl font-bold mb-6">Interview Summary</h1>

        {/* SUMMARY CARD */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow mb-6">
          <p className="text-xl mb-2">Final Confidence: <b>{data.confidence}%</b></p>
          <p className="mb-2">Dominant Emotion: <b>{data.dominantEmotion}</b></p>
          <p className="text-indigo-600 dark:text-indigo-400 font-medium">{summary}</p>
        </div>

        {/* CHART */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Confidence Trend</h2>
          <Line data={chartData} />
        </div>

        {/* HISTORY TABLE */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Interview History</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-300 dark:border-slate-600">
                  <th className="p-2">Date</th>
                  <th className="p-2">Confidence</th>
                  <th className="p-2">Emotion</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, i) => (
                  <tr key={i} className="border-b border-slate-200 dark:border-slate-700">
                    <td className="p-2">{item.date}</td>
                    <td className="p-2">{item.confidence}%</td>
                    <td className="p-2">{item.dominantEmotion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>

      {/* PDF BUTTON */}
      <div className="mt-6">
        <button
          onClick={downloadPDF}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
        >
          Download PDF Report
        </button>
      </div>

    </div>
  );
}
