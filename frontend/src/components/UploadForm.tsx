import React, { useCallback, useMemo, useRef, useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboard";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
      const res = await axios.post(`${API_BASE}/analyze`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const enriched = {
        ...res.data,
        resume_name: resume?.name || "Uploaded Resume",
        id: (res.data && res.data.id) || String(Date.now()),
      };

      setResult(enriched);
      setSuccess("Analysis complete!");
      setShowDashboard(false);

      navigate("/analysis", { state: { analysis: enriched } });
    } catch (err) {
      console.error(err);
      setError("Error analyzing resume. Please try again.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

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
      "We are looking for a Frontend Engineer with strong React, TypeScript, and CSS skills. Experience with Vite, Tailwind, RESTful APIs, and testing frameworks is required. Familiarity with state management and accessibility best practices is a plus.",
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
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700 border border-green-200">
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
            className={`w-full p-6 border-2 rounded-xl ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-dashed border-gray-300"
            }`}
          >
            <div className="flex flex-col items-center text-center">
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

              <p className="mt-1 text-xs text-gray-400">
                Max {MAX_FILE_MB}MB • PDF only
              </p>
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
            <div className="mt-2 flex justify-between text-xs text-gray-600">
              <div>Selected: {resume.name}</div>
              <button
                type="button"
                className="text-rose-600 hover:underline"
                onClick={handleRemoveFile}
              >
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <div className="mt-1 flex justify-between text-xs text-gray-500">
            <div className={jobDescriptionTooShort ? "text-red-600" : ""}>
              {jobDescriptionChars} characters
            </div>

            <button
              type="button"
              className="text-blue-700 hover:underline"
              onClick={fillSampleJD}
            >
              Use example
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className={`w-full py-2 px-4 rounded-lg text-white font-semibold ${
            !canSubmit ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>

        <div className="flex justify-between text-sm">
          <button
            type="button"
            className="text-gray-500 hover:underline"
            onClick={clearAll}
          >
            Clear form
          </button>

          <div className="text-gray-400">
            By continuing, you agree to local processing.
          </div>
        </div>
      </form>

      {result && !showDashboard && (
        <div className="mt-8 p-6 rounded-xl shadow bg-gray-50">
          <h3
            className={`text-xl font-bold mb-2 px-3 py-2 rounded-lg inline-block ${getScoreColor(
              result.match_score,
            )}`}
          >
            Match Score: {result.match_score}%
          </h3>

          <p className="mt-2 text-gray-700">
            <strong>Suggestions:</strong> {result.suggestions}
          </p>

          <button
            className="mt-6 w-full py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold"
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
