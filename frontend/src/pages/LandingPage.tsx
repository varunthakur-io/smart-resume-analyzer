import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar, { BrandLogo } from "../components/Navbar";

const LandingPage: React.FC = () => {
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
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 transition-colors duration-300 selection:bg-zinc-900 selection:text-zinc-50 dark:selection:bg-zinc-50 dark:selection:text-zinc-950">
      <Navbar 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode} 
        showLinks={true}
        actions={
          <button 
            className="btn-primary h-9 px-4 rounded-md"
            onClick={() => navigate("/upload")}
          >
            Get Started
          </button>
        }
      />

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 overflow-hidden border-b border-zinc-100 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-3 py-1 text-xs font-medium mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-zinc-500"></span>
            </span>
            New: Advanced Score Breakdown Now Live
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 animate-fade-in">
            Landing your next role <br />
            <span className="text-zinc-500 dark:text-zinc-400">shouldn't be a mystery.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-zinc-600 dark:text-zinc-400 mb-10 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            The minimal resume intelligence platform that analyzes job descriptions and reveals exactly where your profile aligns.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <button 
              className="btn-primary h-12 px-8 text-base rounded-md"
              onClick={() => navigate("/upload")}
            >
              Analyze Resume
            </button>
            <button className="btn-outline h-12 px-8 text-base rounded-md">
              View Demo
            </button>
          </div>

          <div className="mt-20">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-8">Used by professionals at</p>
            <div className="flex flex-wrap justify-center gap-12 items-center grayscale opacity-40 transition-all">
              <span className="text-xl font-bold tracking-tighter">GITHUB</span>
              <span className="text-xl font-bold tracking-tighter">LINEAR</span>
              <span className="text-xl font-bold tracking-tighter">VERCEL</span>
              <span className="text-xl font-bold tracking-tighter">RAILWAY</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Semantic Analysis", desc: "Our AI understands context, mapping your experience directly to Job Requirements.", icon: "01" },
              { title: "ATS Optimization", desc: "Identify the critical gaps that cause systems to filter out your profile automatically.", icon: "02" },
              { title: "Skill Insights", desc: "A granular breakdown of your strengths versus what the employer is seeking.", icon: "03" }
            ].map((f, i) => (
              <div key={i} className="group relative p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all">
                <div className="text-xs font-bold text-zinc-400 mb-4 tracking-tighter">{f.icon}</div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Simple Pricing</h2>
            <p className="text-zinc-600 dark:text-zinc-400">Everything you need, nothing you don't.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Basic */}
            <div className="flex flex-col p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
              <h3 className="font-bold mb-2">Free</h3>
              <div className="text-3xl font-bold mb-6">$0</div>
              <ul className="space-y-3 mb-8 text-sm text-zinc-600 dark:text-zinc-400 flex-1">
                <li>• 5 Analyses / mo</li>
                <li>• Basic Match Score</li>
                <li>• Skill Extraction</li>
              </ul>
              <button className="btn-outline w-full" onClick={() => navigate("/upload")}>Get Started</button>
            </div>

            {/* Pro */}
            <div className="flex flex-col p-8 rounded-xl border border-zinc-950 dark:border-zinc-50 bg-zinc-950 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-950 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-tighter">Popular</div>
              <h3 className="font-bold mb-2">Pro</h3>
              <div className="text-3xl font-bold mb-6">$19</div>
              <ul className="space-y-3 mb-8 text-sm flex-1 opacity-90">
                <li>• Unlimited Analyses</li>
                <li>• Semantic Insights</li>
                <li>• Custom AI Advice</li>
                <li>• PDF & Word Support</li>
              </ul>
              <button className="w-full h-9 rounded-md font-bold text-sm bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 hover:opacity-90 transition-opacity">Try Free</button>
            </div>

            {/* Agency */}
            <div className="flex flex-col p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
              <h3 className="font-bold mb-2">Enterprise</h3>
              <div className="text-3xl font-bold mb-6">Custom</div>
              <ul className="space-y-3 mb-8 text-sm text-zinc-600 dark:text-zinc-400 flex-1">
                <li>• Team Management</li>
                <li>• API Access</li>
                <li>• Bulk Processing</li>
              </ul>
              <button className="btn-outline w-full">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-100 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-2">
            <BrandLogo className="h-4 w-4" />
            <span className="font-bold text-sm tracking-tight">NextRole</span>
          </div>
          <div className="flex gap-8 text-xs font-medium text-zinc-500">
            <a href="#" className="hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors">Terms</a>
            <a href="#" className="hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors">Twitter</a>
          </div>
          <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} NextRole
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
