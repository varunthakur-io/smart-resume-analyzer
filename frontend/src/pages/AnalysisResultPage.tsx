import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Dashboard from "../components/Dashboard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface Analysis {
  id: string;
  resume_name: string;
  match_score: number;
  extracted_skills?: string[];
  missing_skills?: string[];
  suggestions?: string;
  resume_file?: string | null;
  breakdown?: Record<string, number>;
}

const AnalysisResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [deleteMsg, setDeleteMsg] = useState<string | null>(null);
  const [resumeDeleted, setResumeDeleted] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark" || 
    (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const analysis = useMemo(() => {
    const state = location.state as { analysis?: Analysis };
    return state?.analysis;
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
    if (!window.confirm("Delete original file?")) return;
    try {
      setDeleting(true);
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_BASE}/resumes/${analysis.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setResumeDeleted(true);
      setDeleteMsg("File purged.");
    } catch {
      setDeleteMsg("Failed to delete.");
    }
  };

  if (!analysis) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center p-12 border border-zinc-200 dark:border-zinc-800 rounded-xl animate-fade-in">
          <h1 className="text-xl font-bold mb-4">No Analysis Found</h1>
          <button className="btn-primary w-full" onClick={() => navigate("/upload")}>Return to Upload</button>
        </div>
      </div>
    );
  }

  const matched = Array.isArray(analysis.extracted_skills) ? analysis.extracted_skills : [];
  const missing = Array.isArray(analysis.missing_skills) ? analysis.missing_skills : [];
  const canShowDelete = !!analysis.resume_file && !resumeDeleted;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      <Navbar 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode} 
        actions={
          <div className="flex items-center space-x-2">
            <button className="btn-secondary h-8 text-xs px-3 rounded-md" onClick={() => navigate("/upload")}>New</button>
            <button className="btn-primary h-8 text-xs px-3 rounded-md" onClick={downloadJson}>Export</button>
          </div>
        }
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-32 sm:pt-40 animate-fade-in">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* Left: Score */}
          <div className="lg:col-span-4 flex flex-col items-center text-center lg:sticky lg:top-32">
            <div className="w-56 h-56 mb-8 group relative">
              <CircularProgressbar
                value={analysis.match_score}
                text={`${analysis.match_score}%`}
                strokeWidth={7}
                styles={buildStyles({
                  pathColor: isDarkMode ? "#fafafa" : "#18181b",
                  textColor: isDarkMode ? "#fafafa" : "#18181b",
                  trailColor: isDarkMode ? "#27272a" : "#f4f4f5",
                  pathTransitionDuration: 1.5,
                })}
              />
              <div className="absolute inset-0 rounded-full bg-zinc-900/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">{analysis.resume_name}</h1>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em]">Match Accuracy</p>
            </div>
            
            <button 
              onClick={() => setShowCharts(!showCharts)}
              className={`mt-8 w-full max-w-[240px] py-3 rounded-md text-xs font-black uppercase tracking-widest transition-all border ${
                showCharts 
                ? "bg-zinc-900 text-zinc-50 border-zinc-900 dark:bg-zinc-50 dark:text-zinc-900 dark:border-zinc-50" 
                : "bg-transparent text-zinc-900 border-zinc-200 hover:border-zinc-900 dark:text-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-50"
              }`}
            >
              {showCharts ? "Hide Visual Analytics" : "View Visual Analytics"}
            </button>

            <div className="w-full h-px bg-zinc-100 dark:bg-zinc-900 my-10" />
            
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="p-5 rounded-xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50/30 dark:bg-zinc-900/30 text-center">
                <div className="text-3xl font-bold tracking-tighter">{matched.length}</div>
                <div className="text-[10px] font-bold uppercase text-zinc-400 mt-1">Matched</div>
              </div>
              <div className="p-5 rounded-xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50/30 dark:bg-zinc-900/30 text-center">
                <div className="text-3xl font-bold tracking-tighter">{missing.length}</div>
                <div className="text-[10px] font-bold uppercase text-zinc-400 mt-1">Gaps</div>
              </div>
            </div>

            {canShowDelete && (
              <button onClick={handleDeleteResume} className="mt-10 text-[10px] font-bold text-zinc-400 hover:text-red-500 uppercase tracking-widest transition-colors">
                Purge Analysis Data
              </button>
            )}
            {deleteMsg && <p className="mt-4 text-[10px] font-bold text-zinc-400">{deleteMsg}</p>}
          </div>

          {/* Right: Data */}
          <div className="lg:col-span-8 space-y-16">
            {showCharts && (
              <div className="animate-fade-in pb-12 border-b border-zinc-100 dark:border-zinc-900">
                <Dashboard 
                  matchScore={analysis.match_score}
                  extractedSkills={matched}
                  missingSkills={missing}
                  resumeName={analysis.resume_name}
                  onBack={() => setShowCharts(false)}
                  breakdown={analysis.breakdown}
                  isDarkMode={isDarkMode}
                />
              </div>
            )}

            {/* AI Action Plan */}
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400">Action Plan</h2>
                <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-900" />
              </div>
              <div className="grid gap-4">
                {analysis.suggestions ? analysis.suggestions.split(". ").filter(s => s.trim()).map((step, i) => (
                  <div key={i} className="flex gap-5 p-6 rounded-xl border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shadow-sm hover:shadow-md transition-shadow">
                    <div className="mt-1.5 h-2 w-2 rounded-full bg-zinc-900 dark:bg-zinc-50 flex-shrink-0" />
                    <p className="text-sm font-medium leading-relaxed text-zinc-700 dark:text-zinc-300">{step.trim()}.</p>
                  </div>
                )) : <p className="text-sm text-zinc-400 italic font-medium">No strategic suggestions available for this profile.</p>}
              </div>
            </section>

            {/* Skills Matrix */}
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
              <section className="space-y-8">
                <div className="flex items-center gap-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400">Strengths</h3>
                  <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-900" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {matched.length > 0 ? matched.map((s, i) => (
                    <span key={i} className="inline-flex items-center rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1 text-[11px] font-bold uppercase tracking-tight text-zinc-700 dark:text-zinc-300 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800">
                      {s}
                    </span>
                  )) : <p className="text-xs text-zinc-400 italic">No significant keyword matches detected.</p>}
                </div>
              </section>

              <section className="space-y-8">
                <div className="flex items-center gap-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400">Gaps</h3>
                  <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-900" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {missing.length > 0 ? missing.map((s, i) => (
                    <span key={i} className="inline-flex items-center rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-1 text-[11px] font-bold uppercase tracking-tight opacity-50 text-zinc-500 hover:opacity-100 transition-opacity">
                      {s}
                    </span>
                  )) : <p className="text-xs text-zinc-400 italic">Resume aligns with all critical requirements.</p>}
                </div>
              </section>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AnalysisResultPage;
