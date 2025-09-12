# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Smart Resume Analyzer is an AI-powered monorepo application that analyzes resume-to-job-description matches using semantic embedding similarity. The application provides match scores, extracts skills, identifies missing skills, and offers tailored suggestions for resume improvement.

## Development Commands

### Full Stack Development
```powershell
# Start both backend and frontend simultaneously
npm run dev

# Start backend only (Flask API on http://localhost:5000)
npm run dev:backend

# Start frontend only (Vite dev server on http://localhost:5173)
npm run dev:frontend
```

### Backend Development
```powershell
cd backend

# Create and activate virtual environment (first time setup)
python -m venv venv
venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Download spaCy model if not present
python -m spacy download en_core_web_sm

# Run Flask API server
python app.py
```

### Frontend Development  
```powershell
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Architecture Overview

### Backend Architecture (Flask + AI/ML)
- **Entry Point**: `app.py` - Flask app with CORS, routes for analyze/list/delete operations
- **Business Logic**: `services.py` - `AnalysisService` handles file management, analysis orchestration, and data persistence
- **AI Processing**: 
  - `utils/matcher.py` - Core semantic matching using sentence-transformers (MiniLM) and spaCy NLP
  - `utils/extractor.py` - PDF text extraction using PyMuPDF
- **Configuration**: `config.py` - Environment-aware settings for paths, thresholds, and server config
- **Data Storage**: File-based storage in `uploads/` (PDFs) and `analyses/` (JSON results)

### Frontend Architecture (React + TypeScript)
- **Routing**: React Router with three main routes:
  - `/` - Landing page
  - `/upload` - Resume upload form 
  - `/analysis` - Analysis results display
- **Components**:
  - `UploadForm.tsx` - File upload and job description input
  - `Dashboard.tsx` - Analysis results visualization
  - Page components in `pages/` directory
- **Build System**: Vite with TypeScript, Tailwind CSS for styling

### AI/ML Pipeline Flow
1. **Text Extraction**: PyMuPDF extracts text from uploaded PDF resumes
2. **Semantic Embedding**: sentence-transformers (MiniLM model) generates embeddings for resume and job description
3. **Document Similarity**: Cosine similarity between document embeddings produces overall match score
4. **Skill Detection**: Two-phase approach:
   - **Canonical Skills**: Predefined skills from `backend/data/skills.txt` matched via substring + semantic similarity
   - **Dynamic Skills**: spaCy NLP extracts noun chunks and proper nouns from job descriptions as candidate skills
5. **Presence Analysis**: Determines which job requirements are present in resume using embedding similarity
6. **Suggestions**: Rule-based recommendations based on match score and missing skills

## Key Configuration & Thresholds

The AI matching system uses configurable thresholds via environment variables:
- `SKILL_IN_RESUME_THRESHOLD` (default: 0.55) - Semantic similarity threshold for detecting canonical skills in resume
- `SKILL_IN_JD_THRESHOLD` (default: 0.60) - Threshold for detecting canonical skills in job descriptions  
- `CANDIDATE_SIM_THRESHOLD` (default: 0.58) - Threshold for determining if dynamic candidates are present in resume
- `MIN_CANDIDATE_LEN` (default: 3) - Minimum length for candidate skill phrases
- `MAX_CANDIDATES` (default: 40) - Maximum number of candidate skills to extract

## Development Patterns

### Backend Development
- **Error Handling**: All routes have try-catch with appropriate HTTP status codes and user-friendly error messages
- **File Management**: UUIDs for unique filenames, separate upload and analysis storage directories
- **AI Model Loading**: Models loaded once at startup with `@lru_cache` decorators for performance
- **Configuration**: Environment variables with sensible defaults, directories created automatically

### Frontend Development  
- **State Management**: React hooks for local state, navigation via React Router
- **API Integration**: Axios for HTTP requests with proper error handling
- **Styling**: Tailwind CSS classes for responsive, professional UI
- **File Handling**: FormData for multipart file uploads to backend API

### Testing Endpoints
```powershell
# Health check
curl http://localhost:5000/healthz

# Upload and analyze (replace with actual files)
curl -X POST http://localhost:5000/analyze -F "resume=@resume.pdf" -F "job_description=Software Engineer position requiring Python..."

# List analyses
curl http://localhost:5000/analyses

# Delete analysis and resume file
curl -X DELETE http://localhost:5000/analyses/[analysis_id]

# Delete only resume file (preserve analysis)
curl -X DELETE http://localhost:5000/resumes/[analysis_id]
```

## File Structure Context

- **Monorepo Layout**: Separate `backend/` and `frontend/` directories with independent package management
- **Data Persistence**: File-based JSON storage in `backend/analyses/` and file uploads in `backend/uploads/` (both gitignored)
- **Skills Database**: Canonical skills maintained in `backend/data/skills.txt` (version controlled)
- **AI Models**: Downloaded automatically - sentence-transformers and spaCy models cached locally

## Environment Setup Notes

- **Python Requirements**: Requires Python 3.10+ for modern type hints and ML libraries
- **Node Requirements**: Requires Node 18+ for Vite and modern React features
- **ML Dependencies**: First run downloads ~500MB of AI models (sentence-transformers + spaCy)
- **File Permissions**: Ensure backend process can write to `uploads/` and `analyses/` directories