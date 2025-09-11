// src/App.tsx
import "./App.css";
import UploadForm from "./components/UploadForm";
import cvLogo from "./assets/cv.png";
function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
      {/* Header */}
      <header className="w-full bg-white shadow-md py-4 px-8 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src={cvLogo} alt="Logo" className="h-8 w-8" />
          <span className="text-2xl font-bold text-blue-700 tracking-tight">
            Smart Resume Analyzer
          </span>
        </div>
        <span className="text-sm text-gray-400 font-mono">
          AI-powered Resume Insights
        </span>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center">
        <UploadForm />
      </main>
    </div>
  );
}

export default App;
