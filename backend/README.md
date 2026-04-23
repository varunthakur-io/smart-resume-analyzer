# Smart Resume Analyzer - Backend

This is the AI-powered backend for the Smart Resume Analyzer, built with Flask and Python. It leverages Natural Language Processing (NLP) to calculate the semantic similarity between resumes and job descriptions.

## Tech Stack
- **Framework:** [Flask](https://flask.palletsprojects.com/)
- **AI Models:** 
  - [Sentence-Transformers](https://www.sbert.net/) (`all-MiniLM-L6-v2`) for semantic embeddings.
  - [spaCy](https://spacy.io/) (`en_core_web_sm`) for entity extraction and noun chunking.
- **PDF Parsing:** [PyMuPDF](https://pymupdf.readthedocs.io/)
- **Server:** [Gunicorn](https://gunicorn.org/) (Production)

## Key Features
- **Semantic Matching:** Calculates a match score based on document embeddings rather than just keywords.
- **Skill Extraction:** Automatically identifies matched and missing skills using both a canonical list and dynamic JD extraction.
- **Privacy-First:** Users can delete their uploaded PDF files while retaining the analysis metadata.

## Local Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python -m venv venv
   # Windows
   .\venv\Scripts\Activate.ps1
   # Linux/macOS
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Download the spaCy model:**
   ```bash
   python -m spacy download en_core_web_sm
   ```

5. **Run the development server:**
   ```bash
   python app.py
   ```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/healthz` | Health check for the API. |
| POST | `/analyze` | Upload a PDF resume and JD string for analysis. |
| GET | `/analyses` | List all stored analysis metadata. |
| DELETE | `/analyses/<id>` | Delete a specific analysis and its associated PDF. |
| DELETE | `/resumes/<id>` | Delete only the PDF file for a specific analysis. |

## Configuration
Configuration is managed in `config.py`. Key environment variables include:
- `PORT`: The port to run the server on (default: 5000).
- `CORS_ORIGINS`: Allowed origins for CORS.
- `SKILL_IN_RESUME_THRESHOLD`: Threshold for detecting a skill in a resume (default: 0.55).
