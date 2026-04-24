import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const TermsPage: React.FC = () => {
  const navigate = useNavigate();
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

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 transition-colors duration-300">
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="max-w-3xl mx-auto px-6 py-32 animate-fade-in">
        <button 
          onClick={() => navigate("/")}
          className="mb-8 text-sm font-bold text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors flex items-center gap-2"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </button>

        <h1 className="text-4xl font-bold tracking-tight mb-8">Terms of Service</h1>
        
        <div className="space-y-6 text-zinc-600 dark:text-zinc-400 leading-relaxed">
          <p>Last updated: April 2026</p>
          
          <section className="space-y-4 text-zinc-950 dark:text-zinc-50">
            <h2 className="text-xl font-bold tracking-tight">1. Acceptance of Terms</h2>
            <p className="text-zinc-600 dark:text-zinc-400 font-medium">
              By using NextRole, you agree to these terms. If you do not agree, please do not use the service.
            </p>
          </section>

          <section className="space-y-4 text-zinc-950 dark:text-zinc-50">
            <h2 className="text-xl font-bold tracking-tight">2. Use of Service</h2>
            <p className="text-zinc-600 dark:text-zinc-400 font-medium">
              NextRole is provided for informational and career development purposes. While our AI provides high-quality insights, we do not guarantee employment results.
            </p>
          </section>

          <section className="space-y-4 text-zinc-950 dark:text-zinc-50">
            <h2 className="text-xl font-bold tracking-tight">3. User Responsibility</h2>
            <p className="text-zinc-600 dark:text-zinc-400 font-medium">
              You are responsible for the content you upload. You must not upload malicious files or content that violates intellectual property rights.
            </p>
          </section>

          <section className="space-y-4 text-zinc-950 dark:text-zinc-50">
            <h2 className="text-xl font-bold tracking-tight">4. Disclaimer</h2>
            <p className="text-zinc-600 dark:text-zinc-400 font-medium">
              NextRole is provided "as is" without any warranties. We are not liable for any discrepancies between our analysis and manual recruiter reviews.
            </p>
          </section>
        </div>
      </main>

      <footer className="py-12 border-t border-zinc-100 dark:border-zinc-900 text-center text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
        © {new Date().getFullYear()} NextRole
      </footer>
    </div>
  );
};

export default TermsPage;
