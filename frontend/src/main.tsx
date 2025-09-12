import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import LandingPage from "./pages/LandingPage";
import AnalysisResultPage from "./pages/AnalysisResultPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/upload" element={<App />} />
        <Route path="/analysis" element={<AnalysisResultPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
