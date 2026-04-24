import React, { useState, useEffect } from "react";
import "./App.css";
import UploadForm from "./components/UploadForm";
import Navbar from "./components/Navbar";

function App() {
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
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col transition-colors duration-300">
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 pt-28">
        <div className="w-full max-w-4xl">
          <div className="mb-8 text-center sm:text-left animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-zinc-50 mb-2">Analyze your match.</h2>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">Upload your resume and the target job description to reveal AI insights.</p>
          </div>
          <UploadForm />
        </div>
      </main>
    </div>
  );
}

export default App;
