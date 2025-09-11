import React, { useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboard";

const UploadForm = () => {
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResume(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!resume || !jobDescription) {
      setError("Please upload a resume and enter a job description.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("job_description", jobDescription);

    setLoading(true);
    try {
      const res = await axios.post("http://192.168.1.3:5000/analyze", formData);
      setResult(res.data);
      setSuccess("Analysis complete!");
      setShowDashboard(false); // Reset dashboard view on new analysis
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

  return (
    <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-8 animate-fade-in">
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
            Upload Resume (PDF)
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleResumeChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
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
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-lg text-white font-semibold shadow transition-all duration-200 ${
            loading
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
            "Submit"
          )}
        </button>
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
