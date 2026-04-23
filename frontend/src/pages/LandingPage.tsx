import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode} 
        showLinks={true}
        actions={
          <button 
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95"
            onClick={() => navigate("/upload")}
          >
            Get Started
          </button>
        }
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* ... (rest of the Hero content) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/10 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-1.5 mb-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 animate-fade-in">
            <span className="flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
            </span>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest text-[10px] sm:text-xs">Next-Gen Resume Intelligence</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 animate-fade-in">
            Unlock your <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400">
              NextRole.
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-400 mb-10 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            The AI-powered platform that analyzes job descriptions and reveals exactly why you're not getting called back. Stop guessing, start landing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <button 
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-black transition-all shadow-xl shadow-indigo-500/25 hover:-translate-y-1"
              onClick={() => navigate("/upload")}
            >
              Analyze My Resume
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-lg font-black border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all hover:-translate-y-1">
              Watch Demo
            </button>
          </div>

          {/* Social Proof Placeholder */}
          <div className="mt-20 opacity-50 grayscale dark:invert transition-all">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] mb-8">Empowering candidates worldwide</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center font-black text-xl sm:text-2xl">
              <span>GOOGLE</span>
              <span>AMAZON</span>
              <span>META</span>
              <span>STRIPE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-24 bg-white dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">Everything you need to land the job.</h2>
            <p className="text-slate-600 dark:text-slate-400">Built for modern professionals who value data-driven results.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Semantic Analysis", desc: "Our AI understands context, not just keywords. It knows that 'Coding' is related to 'Software Engineering'.", icon: "🧠" },
              { title: "ATS Optimization", desc: "Identify the critical gaps that cause Applicant Tracking Systems to filter out your profile automatically.", icon: "⚡" },
              { title: "Skill Gap Map", desc: "A visual heat-map of your strengths versus what the employer is actually looking for.", icon: "📊" }
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:border-indigo-500 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{f.icon}</div>
                <h3 className="text-xl font-black mb-3">{f.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">Transparent Pricing</h2>
            <p className="text-slate-600 dark:text-slate-400">Start for free, upgrade when you're ready to scale your career.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-center">
            {/* Basic */}
            <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-transform hover:scale-[1.02]">
              <h3 className="text-lg font-bold mb-2">Free</h3>
              <div className="text-4xl font-black mb-6">$0<span className="text-base font-normal text-slate-500">/mo</span></div>
              <ul className="space-y-4 mb-8 text-sm">
                <li className="flex items-center text-slate-600 dark:text-slate-400">✓ 5 Analyses per month</li>
                <li className="flex items-center text-slate-600 dark:text-slate-400">✓ Basic Match Score</li>
                <li className="flex items-center text-slate-600 dark:text-slate-400">✓ Skill Extraction</li>
              </ul>
              <button className="w-full py-3 rounded-xl border border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all">Get Started</button>
            </div>

            {/* Pro - Featured */}
            <div className="p-8 rounded-3xl bg-indigo-600 text-white transform scale-105 shadow-2xl shadow-indigo-500/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-indigo-500 px-4 py-1 rounded-bl-xl text-xs font-black uppercase tracking-widest">Most Popular</div>
              <h3 className="text-lg font-bold mb-2">Pro</h3>
              <div className="text-4xl font-black mb-6">$19<span className="text-base font-normal opacity-80">/mo</span></div>
              <ul className="space-y-4 mb-8 text-sm">
                <li className="flex items-center">✓ Unlimited Analyses</li>
                <li className="flex items-center">✓ Deep Semantic Insights</li>
                <li className="flex items-center">✓ ATS Gap Fixer</li>
                <li className="flex items-center">✓ Custom AI Suggestions</li>
              </ul>
              <button className="w-full py-3 rounded-xl bg-white text-indigo-600 font-black hover:bg-indigo-50 transition-all">Start Free Trial</button>
            </div>

            {/* Enterprise */}
            <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-transform hover:scale-[1.02]">
              <h3 className="text-lg font-bold mb-2">Agency</h3>
              <div className="text-4xl font-black mb-6">$99<span className="text-base font-normal text-slate-500">/mo</span></div>
              <ul className="space-y-4 mb-8 text-sm">
                <li className="flex items-center text-slate-600 dark:text-slate-400">✓ Multi-user Access</li>
                <li className="flex items-center text-slate-600 dark:text-slate-400">✓ API Access</li>
                <li className="flex items-center text-slate-600 dark:text-slate-400">✓ Bulk Resume Processing</li>
              </ul>
              <button className="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-100 dark:bg-slate-950 py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => navigate("/")}>
            <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-black text-lg">NextRole.</span>
          </div>
          <div className="flex gap-8 text-sm font-bold text-slate-500">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Contact</a>
          </div>
          <div className="text-xs text-slate-400 font-bold">
            © {new Date().getFullYear()} NextRole. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
