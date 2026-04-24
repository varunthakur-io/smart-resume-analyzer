import React, { useCallback, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const UploadForm = () => {
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const MAX_FILE_MB = 10;
  const jobDescriptionChars = jobDescription.length;
  const jobDescriptionTooShort = jobDescriptionChars < 40;
  const canSubmit = !!resume && !jobDescriptionTooShort && !loading;

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
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
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

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in transition-all duration-300">
      <div className="w-full min-h-[500px] grid lg:grid-cols-2 gap-6 items-stretch">
        {/* Left Column: File Upload */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-50">1. Upload Resume</h3>
          </div>

          <div
            onDragEnter={onDragEnter}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-all duration-200 px-6 text-center group cursor-pointer ${
              dragActive 
                ? "border-zinc-950 bg-zinc-50 dark:border-zinc-50 dark:bg-zinc-800/50" 
                : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
            } ${resume ? "border-zinc-950 dark:border-zinc-50 animate-success-pop" : ""}`}
            onClick={() => !resume && fileInputRef.current?.click()}
          >
            {resume ? (
              <div className="flex flex-col items-center">
                <div className="bg-zinc-950 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-950 p-3 rounded-full mb-3 shadow-md">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-bold text-zinc-950 dark:text-zinc-50 text-xs block mb-1 truncate max-w-[200px]">{resume.name}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); setResume(null); }}
                  className="mt-3 text-[10px] font-bold text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-300 transition-colors uppercase tracking-tighter underline underline-offset-4"
                >
                  Replace
                </button>
              </div>
            ) : (
              <>
                <div className="text-zinc-400 dark:text-zinc-600 mb-3 group-hover:text-zinc-950 dark:group-hover:text-zinc-50 transition-colors">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium mb-1">Click or drag & drop PDF, DOCX</p>
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
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col shadow-sm">
          <div className="mb-4 flex justify-between items-start">
            <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-50">2. Job Description</h3>
            <button 
              type="button" 
              onClick={() => setJobDescription("Senior Software Engineer with Python/React experience...")}
              className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest hover:text-zinc-950 dark:hover:text-zinc-50"
            >
              Use Example
            </button>
          </div>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste requirements here..."
            className="flex-1 w-full p-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-zinc-950 dark:focus:border-zinc-50 rounded-lg outline-none transition-all resize-none text-xs font-medium dark:text-zinc-50"
          />

          <div className="mt-3 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
            <div className={jobDescriptionTooShort ? "text-zinc-400" : "text-zinc-500"}>
              {jobDescriptionChars} chars
            </div>
            {jobDescriptionChars > 0 && (
              <button onClick={() => setJobDescription("")} className="text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50">Clear</button>
            )}
          </div>
        </div>
      </div>

      {/* Compact Action Footer */}
      <div className="flex flex-col items-center shrink-0 pb-2">
        {error && (
          <div className="mb-4 px-4 py-1.5 rounded-md bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-[10px] font-bold border border-rose-100 dark:border-rose-900 animate-fade-in">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="btn-primary w-full max-w-sm h-11 text-xs font-bold rounded-md disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
              Analyzing...
            </span>
          ) : (
            "Analyze Compatibility"
          )}
        </button>
      </div>
    </div>
  );
};

export default UploadForm;
