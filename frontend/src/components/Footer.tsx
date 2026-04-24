import React from "react";
import { Link } from "react-router-dom";
import { BrandLogo } from "./Navbar";

interface FooterProps {
  isDarkMode?: boolean;
}

const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="py-6 border-t border-zinc-100 dark:border-zinc-900 transition-colors duration-300 shrink-0 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center space-x-2">
            <BrandLogo className="h-4 w-4" />
            <span className="font-bold text-xs tracking-tight text-zinc-900 dark:text-zinc-50">NextRole</span>
          </div>
          <div className="flex gap-6 text-[11px] font-bold uppercase tracking-widest text-zinc-400">
            <Link to="/privacy" className="hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors">Terms</Link>
          </div>
        </div>
        <a 
          href="https://x.com/varunthakur_in" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-950 dark:text-zinc-50 hover:opacity-70 transition-opacity"
        >
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 7.719L22.875 21.75h-6.656l-5.203-6.817-5.966 6.817H1.742l7.73-8.267L1.125 2.25h6.826l4.695 6.148 5.603-6.148zM16.425 19.77h1.832L7.383 4.126H5.417L16.425 19.77z"/>
          </svg>
          Built by Varun Thakur
        </a>
      </div>
    </footer>
  );
};

export default Footer;
