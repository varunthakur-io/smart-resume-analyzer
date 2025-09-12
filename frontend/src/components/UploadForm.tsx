import React, { useCallback, useMemo, useRef, useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboard";
import { useNavigate } from "react-router-dom";

const UploadForm = () => {
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);
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
      if (file && file.type !== "application/pdf") {
        setError("Only PDF files are supported.");
        return;
      }
      if (file && file.size > MAX_FILE_MB * 1024 * 1024) {
        setError(`File is too large. Max ${MAX_FILE_MB}MB.`);
        return;
      }
      setError(null);
      setResume(file);
    }
  };

  const onDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type !== "application/pdf") {
        setError("Only PDF files are supported.");
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

  const fileLabel = useMemo(() => {
    if (!resume) return "Upload Resume (PDF)";
    const sizeMb = (resume.size / (1024 * 1024)).toFixed(2);
    return `${resume.name} • ${sizeMb} MB`;
  }, [resume]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!resume) {
      setError("Please upload a PDF resume.");
      return;
    }
    if (jobDescriptionTooShort) {
      setError("Please paste a job description (at least 40 characters).");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("job_description", jobDescription);

    setLoading(true);
    try {
      const res = await axios.post("http://192.168.1.3:5000/analyze", formData);
      const enriched = {
        ...res.data,
        resume_name: resume?.name || "Uploaded Resume",
        id: (res.data && (res.data.id as string)) || String(Date.now()),
      };
      setResult(enriched);
      setSuccess("Analysis complete!");
      setShowDashboard(false);
      navigate("/analysis", { state: { analysis: enriched } });
    } catch (err) {
      setError("Error analyzing resume. Please try again.");
      setResult(null);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Helper for color-coded score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-700 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const handleRemoveFile = () => {
    setResume(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const fillSampleJD = () => {
    setJobDescription(
      "We are looking for a Frontend Engineer with strong React, TypeScript, and CSS skills. Experience with Vite, Tailwind, RESTful APIs, and testing frameworks is required. Familiarity with state management and accessibility best practices is a plus."
    );
  };

  const clearAll = () => {
    setResume(null);
    setJobDescription("");
    setResult(null);
    setShowDashboard(false);
    setError(null);
    setSuccess(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 animate-fade-in">
      {/* Notifications */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 border border-red-200 animate-shake">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700 border border-green-200 animate-fade-in">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {fileLabel}
          </label>
          <div
            onDragEnter={onDragEnter}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`w-full p-6 border-2 rounded-xl transition ${
              dragActive ? "border-blue-500 bg-blue-50" : "border-dashed border-gray-300"
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="mt-2 text-sm text-gray-600">
                Drag and drop your PDF here, or
                <button
                  type="button"
                  className="ml-1 text-blue-700 font-semibold hover:underline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  browse
                </button>
              </p>
              <p className="mt-1 text-xs text-gray-400">Max {MAX_FILE_MB}MB • PDF only</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleResumeChange}
              className="hidden"
            />
          </div>
          {resume && (
            <div className="mt-2 flex justify-between items-center text-xs text-gray-600">
              <div>Selected: {resume.name}</div>
              <button type="button" className="text-rose-600 hover:underline" onClick={handleRemoveFile}>
                Remove file
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paste Job Description
          </label>
          <textarea
            rows={6}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Enter job description here"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          ></textarea>
          <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
            <div className={jobDescriptionTooShort ? "text-rose-600" : ""}>
              {jobDescriptionChars} characters{jobDescriptionTooShort ? " • add more details for better results" : ""}
            </div>
            <div>
              <button type="button" className="text-blue-700 hover:underline" onClick={fillSampleJD}>
                Use example
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className={`w-full py-2 px-4 rounded-lg text-white font-semibold shadow transition-all duration-200 ${
            !canSubmit
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
              Analyzing...
            </span>
          ) : (
            "Analyze Resume"
          )}
        </button>

        <div className="flex justify-between text-sm">
          <button type="button" className="text-gray-500 hover:underline" onClick={clearAll}>
            Clear form
          </button>
          <div className="text-gray-400">By continuing, you agree to local processing.</div>
        </div>
      </form>

      {result && !showDashboard && (
        <div className="mt-8 p-6 rounded-xl shadow bg-gray-50 animate-fade-in">
          <h3
            className={`text-xl font-bold mb-2 px-3 py-2 rounded-lg inline-block ${getScoreColor(
              result.match_score
            )}`}
          >
            Match Score: {result.match_score}%
          </h3>
          {/*
          {result.extracted_skills && (
            <p className="mt-2 text-gray-600">
              <strong>Extracted Skills:</strong> {result.extracted_skills.join(", ") || "None 🎉"}
            </p>
          )}
          {result.missing_skills && (
            <p className="mt-2 text-gray-600">
              <strong>Missing Skills:</strong> {result.missing_skills.join(", ") || "None 🎉"}
            </p>
          )}
          */}
          <p className="mt-2 text-gray-700">
            <strong>Suggestions:</strong> {result.suggestions}
          </p>
          <button
            className="mt-6 w-full py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-all duration-200"
            onClick={() => setShowDashboard(true)}
          >
            View Visual Analytics Dashboard
          </button>
        </div>
      )}

      {result && showDashboard && (
        <Dashboard
          matchScore={result.match_score}
          extractedSkills={result.extracted_skills || []}
          missingSkills={result.missing_skills || []}
        />
      )}
    </div>
  );
};

export default UploadForm;
