import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Dashboard from "../components/Dashboard";

interface Analysis {
  id: string;
  resume_name: string;
  match_score: number;
  extracted_skills?: string[];
  missing_skills?: string[];
}

const DashboardPage: React.FC = () => {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Analysis | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:5000/analyses");
      setAnalyses(res.data);
    } catch (err) {
      setError("Failed to fetch analyses.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this resume and its analysis?")) return;
    try {
      await axios.delete(`http://localhost:5000/analyses/${id}`);
      setAnalyses((prev) => prev.filter((a) => a.id !== id));
      if (selected && selected.id === id) setSelected(null);
    } catch {
      alert("Failed to delete.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-blue-700">All Analyses</h1>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
            onClick={() => navigate("/")}
          >
            ← Back to Upload
          </button>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : analyses.length === 0 ? (
          <div className="text-gray-500">No analyses found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analyses.map((a) => (
              <div
                key={a.id}
                className={`bg-white rounded-xl shadow p-4 border-2 cursor-pointer transition-all ${
                  selected?.id === a.id
                    ? "border-blue-500"
                    : "border-transparent"
                }`}
                onClick={() => setSelected(a)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-lg">{a.resume_name}</div>
                    <div className="text-sm text-gray-500">
                      Score: {a.match_score}%
                    </div>
                  </div>
                  <button
                    className="ml-2 px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 font-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(a.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {selected && (
          <div className="mt-10">
            <Dashboard
              matchScore={selected.match_score}
              extractedSkills={selected.extracted_skills}
              missingSkills={selected.missing_skills}
              onBack={() => setSelected(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
