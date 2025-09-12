import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
ANALYSES_DIR = BASE_DIR / "analyses"
UPLOADS_DIR = BASE_DIR / "uploads"

# Server config
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "5000"))
DEBUG = os.getenv("DEBUG", "true").lower() == "true"

# CORS
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*")

# Matching thresholds (fallbacks set in matcher as well)
SKILL_IN_RESUME_THRESHOLD = os.getenv("SKILL_IN_RESUME_THRESHOLD")
SKILL_IN_JD_THRESHOLD = os.getenv("SKILL_IN_JD_THRESHOLD")
CANDIDATE_SIM_THRESHOLD = os.getenv("CANDIDATE_SIM_THRESHOLD")
MIN_CANDIDATE_LEN = os.getenv("MIN_CANDIDATE_LEN")
MAX_CANDIDATES = os.getenv("MAX_CANDIDATES")

# Ensure directories exist
for d in (ANALYSES_DIR, UPLOADS_DIR):
    d.mkdir(parents=True, exist_ok=True)
