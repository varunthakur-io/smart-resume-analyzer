import React from "react";
import { useNavigate } from "react-router-dom";
import cvLogo from "../assets/cv.png";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-800">
      {/* Nav */}
      <nav className="w-full sticky top-0 bg-white/80 backdrop-blur shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={cvLogo} alt="Logo" className="h-8 w-8" />
            <span className="text-xl font-bold text-blue-700 tracking-tight">
              Smart Resume Analyzer
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-sm">
            <button className="hover:text-blue-700" onClick={() => {
              const el = document.getElementById("features");
              el?.scrollIntoView({ behavior: "smooth" });
            }}>Features</button>
            <button className="hover:text-blue-700" onClick={() => {
              const el = document.getElementById("how-it-works");
              el?.scrollIntoView({ behavior: "smooth" });
            }}>How it works</button>
            <button className="hover:text-blue-700" onClick={() => navigate("/dashboard")}>Dashboard</button>
            <button className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700" onClick={() => navigate("/upload")}>Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="max-w-6xl mx-auto px-6 pt-16 pb-10 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
            Land more interviews with AI-powered resume insights
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Analyze your resume against any job description. Get an instant match score, missing skills, and actionable suggestions. ATS-friendly and recruiter-approved.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow" onClick={() => navigate("/upload")}>Try it free</button>
            <button className="px-6 py-3 rounded-lg bg-white text-blue-700 font-semibold border border-blue-200 hover:bg-blue-50" onClick={() => navigate("/dashboard")}>View analyses</button>
          </div>
          <div className="mt-4 text-xs text-gray-500">No sign-up required</div>
        </div>
        <div className="relative">
          <div className="rounded-2xl border border-blue-100 bg-white shadow-xl p-6">
            <div className="h-48 md:h-64 w-full rounded-xl bg-gradient-to-tr from-blue-100 to-blue-200 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-extrabold text-blue-700">87%</div>
                <div className="text-sm text-gray-600 mt-1">Average match score</div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-lg bg-green-50 text-green-700 border border-green-100">Matched skills</div>
              <div className="p-3 rounded-lg bg-rose-50 text-rose-700 border border-rose-100">Missing skills</div>
              <div className="p-3 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 col-span-2">Actionable suggestions</div>
            </div>
          </div>
        </div>
      </header>

      {/* Social proof */}
      <section className="px-6">
        <div className="max-w-6xl mx-auto rounded-xl bg-white border border-gray-100 shadow-sm p-4 text-center text-sm text-gray-600">
          Trusted by students, engineers, designers and product managers
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">Everything you need to tailor your resume</h2>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm">
            <div className="text-blue-700 font-semibold">ATS-friendly</div>
            <p className="mt-2 text-sm text-gray-600">Clean structure and content suggestions designed to pass applicant tracking systems.</p>
          </div>
          <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm">
            <div className="text-blue-700 font-semibold">Instant match score</div>
            <p className="mt-2 text-sm text-gray-600">Paste a job ad and see your match score with missing skills highlighted.</p>
          </div>
          <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm">
            <div className="text-blue-700 font-semibold">Visual insights</div>
            <p className="mt-2 text-sm text-gray-600">Beautiful charts help you communicate strengths and gaps at a glance.</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-white/70">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">How it works</h2>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm">
              <div className="text-sm font-semibold text-gray-500">Step 1</div>
              <div className="mt-1 font-semibold">Upload your resume</div>
              <p className="mt-2 text-sm text-gray-600">PDF format recommended for best parsing and privacy.</p>
            </div>
            <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm">
              <div className="text-sm font-semibold text-gray-500">Step 2</div>
              <div className="mt-1 font-semibold">Paste the job description</div>
              <p className="mt-2 text-sm text-gray-600">We extract role-specific skills and responsibilities automatically.</p>
            </div>
            <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm">
              <div className="text-sm font-semibold text-gray-500">Step 3</div>
              <div className="mt-1 font-semibold">Get your insights</div>
              <p className="mt-2 text-sm text-gray-600">See your match score, missing skills and tailored suggestions.</p>
            </div>
          </div>
          <div className="mt-10 flex justify-center">
            <button className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow" onClick={() => navigate("/upload")}>
              Start analyzing my resume
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-10 text-sm text-gray-600">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <img src={cvLogo} alt="Logo" className="h-5 w-5" />
            <span className="font-semibold text-gray-800">Smart Resume Analyzer</span>
          </div>
          <div className="flex items-center gap-6">
            <button className="hover:text-blue-700" onClick={() => navigate("/upload")}>Get Started</button>
            <button className="hover:text-blue-700" onClick={() => navigate("/dashboard")}>Dashboard</button>
          </div>
        </div>
        <div className="mt-6 text-xs text-gray-400">© {new Date().getFullYear()} Smart Resume Analyzer. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default LandingPage;


