import React, { useCallback, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const UploadForm = () => {
  // State for file management and JD input
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const MAX_FILE_MB = 10;

  // Derived state for submission validation
  const jobDescriptionChars = jobDescription.length;
  const jobDescriptionTooShort = jobDescriptionChars < 40;
  const canSubmit = !!resume && !jobDescriptionTooShort && !loading;

  // Handle manual file selection via input
  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
      
      if (!validTypes.includes(file.type) && !file.name.endsWith(".docx") && !file.name.endsWith(".txt")) {
        setError("Only PDF, DOCX, and TXT files are supported.");
        return;
      }
      if (file.size > MAX_FILE_MB * 1024 * 1024) {
        setError(`File is too large. Max ${MAX_FILE_MB}MB.`);
        return;
      }
      setError(null);
      setResume(file);
    }
  };

  // Drag-and-drop event handlers for the drop zone
  const onDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(true);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
      
      if (!validTypes.includes(file.type) && !file.name.endsWith(".docx") && !file.name.endsWith(".txt")) {
        setError("Only PDF, DOCX, and TXT files are supported.");
        return;
      }
      if (file.size > MAX_FILE_MB * 1024 * 1024) {
        setError(`File is too large. Max ${MAX_FILE_MB}MB.`);
        return;
      }
      setError(null);
      setResume(file);
      e.dataTransfer.clearData();
    }
  }, []);

  // Main form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("resume", resume!);
    formData.append("job_description", jobDescription);

    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/analyze`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const enriched = {
        id: res.data.id || String(Date.now()),
        resume_name: resume?.name || res.data.resume_name || "Uploaded Resume",
        match_score: res.data.match_score ?? 0,
        extracted_skills: res.data.extracted_skills || [],
        missing_skills: res.data.missing_skills || [],
        suggestions: res.data.suggestions || "",
        resume_file: res.data.resume_file || null,
        breakdown: res.data.breakdown || {}
      };

      navigate("/analysis", { state: { analysis: enriched } });
    } catch (err) {
      console.error(err);
      setError("Analysis failed. Please ensure the backend is online.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFile = () => {
    setResume(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const fillSampleJD = () => {
    setJobDescription(
      "We are looking for a Senior Software Engineer with strong Python and React skills. Experience with AWS, Docker, and distributed systems is required. Familiarity with NLP and machine learning models is a massive plus."
    );
  };

  return (
    <div className="w-full grid lg:grid-cols-2 gap-8 items-stretch animate-fade-in transition-all duration-300">
      {/* Left Column: File Upload */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-8 flex flex-col">
        <div className="mb-6">
          <h3 className="text-xl font-black text-slate-900 dark:text-white">1. Upload Resume</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">PDF, DOCX, or TXT (max 10MB)</p>
        </div>

        <div
          onDragEnter={onDragEnter}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-3xl transition-all duration-300 px-6 py-12 text-center group cursor-pointer ${
            dragActive 
              ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10" 
              : "border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600"
          } ${resume ? "border-green-500 bg-green-50/20 dark:bg-green-900/10 animate-success-pop" : ""}`}
          onClick={() => !resume && fileInputRef.current?.click()}
        >
          {resume ? (
            <div className="flex flex-col items-center">
              <div className="bg-green-500 text-white p-4 rounded-2xl mb-4 shadow-lg shadow-green-500/20">
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="font-black text-slate-900 dark:text-white text-lg block mb-1">{resume.name}</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{(resume.size / (1024 * 1024)).toFixed(2)} MB • Ready</span>
              <button 
                onClick={(e) => { e.stopPropagation(); handleRemoveFile(); }}
                className="mt-6 text-sm font-bold text-rose-500 hover:text-rose-600 transition-colors"
              >
                Replace file
              </button>
            </div>
          ) : (
            <>
              <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-slate-600 dark:text-slate-300 font-bold mb-1">Click to browse or drag & drop</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Supports PDF, DOCX, TXT</p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleResumeChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Right Column: Job Description */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-8 flex flex-col">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">2. Job Description</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Paste the JD you are targeting</p>
          </div>
          <button 
            type="button" 
            onClick={fillSampleJD}
            className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:underline"
          >
            Use Example
          </button>
        </div>

        <textarea
          rows={8}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste requirements, responsibilities, and skills here..."
          className="flex-1 w-full p-6 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 dark:text-white rounded-3xl outline-none transition-all resize-none font-medium placeholder:text-slate-400"
        />

        <div className="mt-4 flex justify-between items-center px-2">
          <div className={`text-xs font-black uppercase tracking-widest ${jobDescriptionTooShort ? "text-rose-500" : "text-slate-400"}`}>
            {jobDescriptionChars} / 40 min chars
          </div>
          {jobDescriptionChars > 0 && (
            <button 
              onClick={() => setJobDescription("")}
              className="text-xs font-black text-slate-400 hover:text-rose-500 uppercase tracking-widest"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Full Width Footer: Submit button and Errors */}
      <div className="lg:col-span-2 flex flex-col items-center pt-4">
        {error && (
          <div className="mb-6 px-6 py-3 rounded-2xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 font-bold border border-rose-100 dark:border-rose-800 animate-fade-in flex items-center gap-2">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`w-full max-w-xl py-5 rounded-3xl text-xl font-black transition-all shadow-2xl flex items-center justify-center gap-4 ${
            !canSubmit 
              ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none" 
              : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/40 hover:-translate-y-1 active:scale-[0.98]"
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>AI Analysis in progress...</span>
            </>
          ) : (
            <>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Run Intelligence Engine</span>
            </>
          )}
        </button>
        
        <p className="mt-6 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
          Data encrypted & processed on secure HuggingFace hardware
        </p>
      </div>
    </div>
  );
};

export default UploadForm;
