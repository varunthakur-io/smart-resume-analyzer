---
title: NextRole - AI Resume Matcher
emoji: ⚡
colorFrom: indigo
colorTo: blue
sdk: docker
pinned: false
---

# NextRole.

AI-powered resume-to-job-description analyzer with a modern UX and professional backend.

## Features

- Minimal, professional landing and analysis UX
- Upload resume (PDF) + paste JD and get:
  - Match score (semantic embedding similarity)
  - Extracted skills vs missing skills
  - Tailored suggestions
- Dedicated Analysis page (`/analysis`) with Download JSON and Delete Resume File actions
- Trust feature: backend endpoint to delete uploaded resume without removing analysis
- Semantic matching with sentence-transformers and dynamic JD candidate extraction (spaCy)

## Tech Stack

- Frontend: React + Vite + TypeScript + Tailwind classes
- Backend: Python, Flask, sentence-transformers (MiniLM), spaCy (en_core_web_sm), PyMuPDF

## Monorepo Layout

```
backend/
  app.py           # Flask app (routes, errors, CORS)
  services.py      # Analysis service: compute, persist, list, delete
  config.py        # Settings (paths, CORS, thresholds)
  utils/
    extractor.py   # PDF text extraction (PyMuPDF)
    matcher.py     # Semantic scoring + dynamic skill extraction
  data/
    skills.txt     # Canonical skills (kept in VCS)
  uploads/         # Uploaded PDFs (gitignored)
  analyses/        # Stored analyses JSON (gitignored)
frontend/
  src/
    pages/
      LandingPage.tsx
      AnalysisResultPage.tsx
    components/
      UploadForm.tsx
      Dashboard.tsx (inline/standalone variants)
    main.tsx, App.tsx, index.css
```

## Prerequisites

- Python 3.10+
- Node 18+

## Backend Setup

```
cd backend
python -m venv venv
# Windows PowerShell
venv\Scripts\Activate.ps1
pip install -r requirements.txt
# Optional: download spaCy model (if not present)
python -m spacy download en_core_web_sm
# Run the API
python app.py
```

- Default server: `http://localhost:5000`
- Health: `GET /healthz`
- Analyze: `POST /analyze` (multipart: resume, job_description)
- List analyses: `GET /analyses`
- Delete analysis: `DELETE /analyses/:id`
- Delete uploaded resume only: `DELETE /resumes/:id`

Environment variables (optional):
- HOST, PORT, DEBUG, CORS_ORIGINS
- SKILL_IN_RESUME_THRESHOLD (default 0.55)
- SKILL_IN_JD_THRESHOLD (0.60)
- CANDIDATE_SIM_THRESHOLD (0.58)
- MIN_CANDIDATE_LEN (3), MAX_CANDIDATES (40)

## Frontend Setup

```
cd frontend
npm install
npm run dev
```

- Frontend dev server: `http://localhost:5173`
- Routes:
  - `/` landing
  - `/upload` upload form
  - `/analysis` analysis results (navigates here after Analyze)

## How Matching Works

- Document-level similarity: cosine similarity of MiniLM embeddings → percentage score
- Canonical skills: loaded from `backend/data/skills.txt` and matched via substrings + embedding similarity
- Dynamic JD skills: extracted using spaCy noun chunks and key nouns; presence checked semantically against the resume
- Suggestions: rule-based guidance based on score and missing skills

## Trust & Privacy

- Uploads stored in `backend/uploads/` and analyses in `backend/analyses/` (both gitignored)
- Users can delete the uploaded resume file via `DELETE /resumes/:id` from the Analysis page

## Production Notes

- Consider a real datastore (Postgres/SQLite) for analyses instead of filesystem JSON
- Add request size limits and MIME validation for uploads
- Serve behind a reverse proxy (NGINX) with HTTPS
- Add structured logging and request IDs

## License

MIT
