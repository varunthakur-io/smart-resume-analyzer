import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Dashboard from "../components/Dashboard";

const BrandLogo = ({ className = "h-8 w-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

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

  // Safely extract analysis data from router state
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
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_BASE}/resumes/${analysis.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete resume file");
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-10 text-center border border-slate-100 dark:border-slate-800 animate-fade-in">
          <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 p-4 rounded-2xl inline-block mb-6">
            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No Analysis Data</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">It seems you haven't uploaded a resume yet or the session expired.</p>
          <button className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-black hover:bg-indigo-700 transition-all" onClick={() => navigate("/upload")}>
            Go to Upload
          </button>
        </div>
      </div>
    );
  }

  const matched = Array.isArray(analysis.extracted_skills) ? analysis.extracted_skills : [];
  const missing = Array.isArray(analysis.missing_skills) ? analysis.missing_skills : [];
  const canShowDelete = !!analysis.resume_file && !resumeDeleted;
  const scoreColor = analysis.match_score >= 80 ? "#10b981" : analysis.match_score >= 60 ? "#f59e0b" : "#f43f5e";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => navigate("/")}>
            <div className="bg-indigo-600 p-1.5 rounded-lg shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-transform">
              <BrandLogo className="h-5 w-5" />
            </div>
            <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 hidden sm:block">
              NextRole.
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
              {isDarkMode ? <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg> : <svg className="h-5 w-5 text-slate-700" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>}
            </button>
            <button className="hidden sm:block px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-300 transition-all" onClick={() => navigate("/upload")}>
              New Analysis
            </button>
            <button className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20" onClick={downloadJson}>
              Export JSON
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 animate-fade-in">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Score & Actions */}
          <div className="lg:col-span-4 space-y-8 sticky top-28">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
              <div className="w-48 h-48 mb-6 cursor-pointer hover:scale-105 transition-transform" onClick={() => setShowCharts(!showCharts)}>
                <CircularProgressbar
                  value={analysis.match_score}
                  text={`${analysis.match_score}%`}
                  strokeWidth={10}
                  styles={buildStyles({
                    pathColor: scoreColor,
                    textColor: isDarkMode ? "#fff" : "#0f172a",
                    trailColor: isDarkMode ? "#1e293b" : "#f1f5f9",
                    pathTransitionDuration: 1.5,
                  })}
                />
              </div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white truncate w-full">{analysis.resume_name}</h1>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">Overall Compatibility</p>
              
              <button 
                onClick={() => setShowCharts(!showCharts)}
                className="mt-6 px-6 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest hover:bg-indigo-100 transition-colors"
              >
                {showCharts ? "Hide Visual Analytics" : "View Visual Analytics"}
              </button>

              <div className="w-full h-px bg-slate-100 dark:bg-slate-800 my-8" />
              
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="p-4 rounded-3xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/30 text-center">
                  <div className="text-3xl font-black text-green-600">{matched.length}</div>
                  <div className="text-[10px] font-black uppercase text-green-600/70 tracking-tighter">Matched Skills</div>
                </div>
                <div className="p-4 rounded-3xl bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/30 text-center">
                  <div className="text-3xl font-black text-rose-600">{missing.length}</div>
                  <div className="text-[10px] font-black uppercase text-rose-600/70 tracking-tighter">Missing Gaps</div>
                </div>
              </div>

              {canShowDelete && (
                <button
                  onClick={handleDeleteResume}
                  disabled={deleting}
                  className="mt-8 text-xs font-black text-rose-500 hover:text-rose-600 uppercase tracking-widest transition-colors flex items-center gap-2"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  {deleting ? "Purging File..." : "Purge Resume from Server"}
                </button>
              )}
              {deleteMsg && <p className="mt-4 text-xs font-bold text-green-500">{deleteMsg}</p>}
            </div>
          </div>

          {/* Right Panel: Detailed Insights */}
          <div className="lg:col-span-8 space-y-8">
            {showCharts && (
              <div className="animate-fade-in">
                <Dashboard 
                  matchScore={analysis.match_score}
                  extractedSkills={matched}
                  missingSkills={missing}
                  resumeName={analysis.resume_name}
                  onBack={() => setShowCharts(false)}
                />
              </div>
            )}

            {/* AI Suggestions Checklist */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <span className="bg-indigo-600 text-white p-2 rounded-xl text-sm">✨</span>
                AI-Generated Action Plan
              </h2>
              <div className="space-y-4">
                {analysis.suggestions ? analysis.suggestions.split(". ").filter(s => s.trim()).map((step, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <div className="mt-1 h-5 w-5 rounded-full border-2 border-indigo-500 flex-shrink-0 group-hover:bg-indigo-500 transition-colors" />
                    <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{step.trim()}.</p>
                  </div>
                )) : (
                  <p className="text-slate-400 italic">No specific suggestions generated for this analysis.</p>
                )}
              </div>
            </div>

            {/* Skills Deep Dive */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Matched */}
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  Strengths Detected
                </h3>
                <div className="flex flex-wrap gap-2">
                  {matched.length > 0 ? matched.map((s, i) => (
                    <span key={i} className="px-4 py-2 rounded-xl bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 text-xs font-black uppercase tracking-widest border border-green-100 dark:border-green-800/30 hover:scale-105 transition-transform cursor-default">
                      {s}
                    </span>
                  )) : <p className="text-slate-400 text-sm italic">No significant strengths identified.</p>}
                </div>
              </div>

              {/* Missing */}
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-rose-500" />
                  Critical Gaps
                </h3>
                <div className="flex flex-wrap gap-2">
                  {missing.length > 0 ? missing.map((s, i) => (
                    <span key={i} className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-900/10 text-rose-700 dark:text-rose-400 text-xs font-black uppercase tracking-widest border border-rose-100 dark:border-rose-800/30 hover:scale-105 transition-transform cursor-default">
                      {s}
                    </span>
                  )) : <p className="text-slate-400 text-sm italic">You've hit every requirement!</p>}
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AnalysisResultPage;
