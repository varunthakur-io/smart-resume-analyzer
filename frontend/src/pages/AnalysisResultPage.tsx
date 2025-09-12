import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface Analysis {
  id: string;
  resume_name: string;
  match_score: number;
  extracted_skills?: string[];
  missing_skills?: string[];
  suggestions?: string;
  resume_file?: string | null;
}

const AnalysisResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState<string | null>(null);
  const [resumeDeleted, setResumeDeleted] = useState(false);
  const analysis = useMemo(() => {
    const state = location.state as any;
    return state?.analysis as Analysis | undefined;
  }, [location.state]);

  const downloadJson = () => {
    if (!analysis) return;
    const blob = new Blob([JSON.stringify(analysis, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${analysis.resume_name.replace(/\s+/g, "_")}_analysis.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteResume = async () => {
    if (!analysis) return;
    if (!window.confirm("Delete the uploaded resume file from the server? This cannot be undone.")) return;
    try {
      setDeleting(true);
      setDeleteMsg(null);
      const res = await fetch(`http://localhost:5000/resumes/${analysis.id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Failed to delete resume file");
      }
      setResumeDeleted(true);
      setDeleteMsg("Resume file deleted from server.");
    } catch (e: any) {
      setDeleteMsg(e?.message || "Failed to delete resume file.");
    } finally {
      setDeleting(false);
    }
  };

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-700">Analysis</h1>
            <button className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700" onClick={() => navigate("/upload")}>
              Go to Upload
            </button>
          </div>
          <div className="mt-6 bg-white rounded-2xl shadow p-8 text-center">
            <p className="text-gray-600">No analysis to show. Please upload a resume and job description to generate an analysis.</p>
          </div>
        </div>
      </div>
    );
  }

  const matched = Array.isArray(analysis.extracted_skills) ? analysis.extracted_skills : [];
  const missing = Array.isArray(analysis.missing_skills) ? analysis.missing_skills : [];
  const canShowDelete = !!analysis.resume_file && !resumeDeleted;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Top Bar */}
      <header className="bg-white/80 backdrop-blur border-b border-blue-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-gray-500">Analysis Result</div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">{analysis.resume_name}</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 rounded bg-white border border-gray-200 text-gray-700 hover:bg-gray-50" onClick={() => navigate("/upload")}>
              New Analysis
            </button>
            <button className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700" onClick={downloadJson}>
              Download JSON
            </button>
            {canShowDelete ? (
              <button
                className={`px-4 py-2 rounded border font-semibold transition ${deleting ? "cursor-not-allowed opacity-60" : ""} border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100`}
                onClick={handleDeleteResume}
                disabled={deleting}
                title="Delete the uploaded resume file from the server"
              >
                {deleting ? "Deleting…" : "Delete Resume File"}
              </button>
            ) : (
              deleteMsg && (
                <span className="px-4 py-2 rounded border border-green-200 bg-green-50 text-green-700 text-sm">
                  {deleteMsg}
                </span>
              )
            )}
          </div>
        </div>
      </header>

      {/* Minimal Content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Hero-like summary */}
        <section className="grid md:grid-cols-3 gap-8 items-end">
          <div className="md:col-span-2">
            <div className="text-sm text-gray-500">Overall Match</div>
            <div className="mt-2 text-6xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              {analysis.match_score}%
            </div>
            {analysis.suggestions && (
              <p className="mt-4 text-gray-700 leading-relaxed">
                {analysis.suggestions}
              </p>
            )}
          </div>
          <div className="flex md:justify-end gap-3">
            <div className="px-4 py-3 rounded-xl bg-green-50 text-green-700 border border-green-100">
              <div className="text-xs uppercase tracking-wide">Matched</div>
              <div className="text-2xl font-bold">{matched.length}</div>
            </div>
            <div className="px-4 py-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-100">
              <div className="text-xs uppercase tracking-wide">Missing</div>
              <div className="text-2xl font-bold">{missing.length}</div>
            </div>
          </div>
        </section>

        {/* Skills lists */}
        <section className="mt-10 grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Matched Skills</h2>
            {matched.length === 0 ? (
              <p className="mt-3 text-gray-500">None</p>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                {matched.map((s, i) => (
                  <span key={`m-${i}`} className="px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-xs md:text-sm">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">Missing Skills</h2>
            {missing.length === 0 ? (
              <p className="mt-3 text-gray-500">None</p>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                {missing.map((s, i) => (
                  <span key={`x-${i}`} className="px-3 py-1.5 rounded-full bg-rose-100 text-rose-700 text-xs md:text-sm">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AnalysisResultPage;
