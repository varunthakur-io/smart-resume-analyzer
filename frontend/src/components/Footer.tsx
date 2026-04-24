import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { BrandLogo } from "./Navbar";

interface FooterProps {
  isDarkMode?: boolean;
}

const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="py-12 border-t border-zinc-100 dark:border-zinc-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center space-x-2">
          <BrandLogo className="h-4 w-4" />
          <span className="font-bold text-sm tracking-tight text-zinc-900 dark:text-zinc-50">NextRole</span>
        </div>
        <div className="flex gap-8 text-xs font-medium text-zinc-500">
          <Link to="/privacy" className="hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors">Terms</Link>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors">Twitter</a>
        </div>
        <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
          © {new Date().getFullYear()} NextRole
        </div>
      </div>
    </footer>
  );
};

export default Footer;
