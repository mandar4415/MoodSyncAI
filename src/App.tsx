import React, { useState, useEffect, useRef } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
} from "chart.js";

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

const mockAIResponses = [
  "Based on your entry, I notice you're feeling quite positive today! ...",
  "I sense some mixed feelings in your entry...",
  "Your mood seems lower than usual...",
  "Your emotional awareness is impressive!",
  "Your entry shows good emotional balance...",
];

const App: React.FC = () => {
  const [moodLevel, setMoodLevel] = useState(3);
  const [description, setDescription] = useState("");
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [moodHistory, setMoodHistory] = useState(() => {
    const savedHistory = localStorage.getItem("moodHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    const ctx = chartRef.current?.getContext("2d");
    if (!ctx) return;

    // Destroy the previous chart instance, if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Create a new chart instance
    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: moodHistory.map((entry: any) =>
          new Date(entry.date).toLocaleDateString()
        ),
        datasets: [
          {
            label: "Mood Level",
            data: moodHistory.map((entry: any) => entry.level),
            borderColor: "#4f46e5",
            backgroundColor: "rgba(79, 70, 229, 0.1)",
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, max: 5 },
          x: { grid: { display: false } },
        },
      },
    });

    // Cleanup function to destroy the chart on unmount or before reinitializing
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [moodHistory]);

  const handleSubmit = async () => {
    if (!description.trim()) {
      alert("Please share your thoughts before generating insights.");
      return;
    }

    setLoading(true);
    setInsights(null);

    setTimeout(() => {
      const randomResponse =
        mockAIResponses[Math.floor(Math.random() * mockAIResponses.length)];
      const newEntry = {
        date: new Date(),
        level: moodLevel,
        description,
        insight: randomResponse,
      };

      const updatedHistory = [...moodHistory, newEntry];
      setMoodHistory(updatedHistory);
      localStorage.setItem("moodHistory", JSON.stringify(updatedHistory));

      setLoading(false);
      setInsights(randomResponse);
      setDescription("");
      setMoodLevel(3);
    }, 1500);
  };

  return (
    <main className="p-4 md:p-8 max-w-4xl mx-auto">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-indigo-600 mb-3">MoodSync AI</h1>
        <p className="text-gray-600">
          Track your emotional journey with AI-powered insights
        </p>
      </header>
      <section className="glass-effect rounded-2xl shadow-lg p-6 mb-8">
        <label className="block text-gray-700 text-lg font-semibold mb-4">
          How's your mood today?
        </label>
        <input
          type="range"
          min="1"
          max="5"
          value={moodLevel}
          onChange={(e) => setMoodLevel(Number(e.target.value))}
          className="mood-slider w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-2xl mt-3">
          <span>😢</span>
          <span>😕</span>
          <span>😐</span>
          <span>🙂</span>
          <span>😊</span>
        </div>
        <label className="block text-gray-700 text-lg font-semibold mb-3 mt-6">
          Share your thoughts
        </label>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={4}
          placeholder="What's on your mind today?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 mt-4"
        >
          Generate AI Insights
        </button>
      </section>
      <section
        className={`glass-effect rounded-2xl shadow-lg p-6 mb-8 ${
          !insights && "hidden"
        }`}
      >
        {loading ? (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Analyzing your emotions...</p>
          </div>
        ) : (
          <div className="prose text-gray-700">{insights}</div>
        )}
      </section>
      <section className="glass-effect rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Mood Timeline
        </h2>
        <canvas id="moodChart" ref={chartRef}></canvas>
      </section>
    </main>
  );
};

export default App;
