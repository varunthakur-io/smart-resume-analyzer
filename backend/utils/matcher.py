import os
import re
from sentence_transformers import SentenceTransformer, util
from pathlib import Path
from functools import lru_cache
from typing import Dict, List, Optional
import spacy

# Load model lazily to speed up boot time and save RAM
_model: Optional[SentenceTransformer] = None

def get_model():
    global _model
    if _model is None:
        print("DEBUG: Loading SentenceTransformer model (all-MiniLM-L6-v2)...")
        _model = SentenceTransformer("all-MiniLM-L6-v2")
        print("DEBUG: Model loaded successfully.")
    return _model


# Load spaCy model once
@lru_cache(maxsize=1)
def get_nlp():
    try:
        print("DEBUG: Loading spaCy model...")
        nlp = spacy.load("en_core_web_sm")
        print("DEBUG: spaCy model loaded successfully.")
        return nlp
    except Exception as e:
        print(f"ERROR: Could not load spaCy model: {e}")
        # Attempt to download if missing (no-op if offline)
        return spacy.blank("en")


# Thresholds configurable via env vars
SKILL_IN_RESUME_THRESHOLD = float(os.getenv("SKILL_IN_RESUME_THRESHOLD", "0.55"))
SKILL_IN_JD_THRESHOLD = float(os.getenv("SKILL_IN_JD_THRESHOLD", "0.60"))
CANDIDATE_SIM_THRESHOLD = float(os.getenv("CANDIDATE_SIM_THRESHOLD", "0.58"))
MIN_CANDIDATE_LEN = int(os.getenv("MIN_CANDIDATE_LEN", "3"))
MAX_CANDIDATES = int(os.getenv("MAX_CANDIDATES", "40"))


@lru_cache(maxsize=1)
def load_skills_list() -> List[str]:
    # skills.txt is located at backend/data/skills.txt relative to this file
    skills_path = Path(__file__).resolve().parents[1] / "data" / "skills.txt"
    skills: List[str] = []
    try:
        with open(skills_path, encoding="utf-8") as f:
            for line in f:
                skill = line.strip()
                if skill:
                    skills.append(skill)
    except Exception:
        # Fallback to a minimal set if file missing
        skills = [
            "Python",
            "JavaScript",
            "React",
            "TypeScript",
            "HTML",
            "CSS",
            "Flask",
            "Django",
            "SQL",
            "REST API",
        ]
    return skills


@lru_cache(maxsize=1)
def load_skill_embeddings() -> Dict[str, List[float]]:
    skills = load_skills_list()
    model = get_model()
    embeddings = model.encode(skills, convert_to_tensor=True)
    # Map skill -> embedding tensor (retain device tensor for cosine sim)
    return {skill: embeddings[i] for i, skill in enumerate(skills)}


def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text or "").strip()


def cleanup_phrase(text: str) -> str:
    t = re.sub(r"[\s\-_/]+", " ", text or "").strip()
    t = t.strip(".,;:!()[]{}\"'`~")
    return t


def extract_candidates_spacy(text: str) -> List[str]:
    """Extract noun chunks and standalone proper/common noun tokens as candidate skills/terms."""
    nlp = get_nlp()
    if not text:
        return []
    try:
        doc = nlp(text)
    except Exception:
        return []

    candidates: List[str] = []
    # Noun chunks
    for chunk in doc.noun_chunks:
        phrase = cleanup_phrase(chunk.text)
        if len(phrase) >= MIN_CANDIDATE_LEN:
            candidates.append(phrase)
    # Significant tokens (PROPN/NOUN) not entirely stop words
    for tok in doc:
        if tok.is_stop or tok.is_punct or tok.like_num:
            continue
        if tok.pos_ in ("PROPN", "NOUN"):
            phrase = cleanup_phrase(tok.text)
            if len(phrase) >= MIN_CANDIDATE_LEN:
                candidates.append(phrase)

    # Deduplicate while preserving order, case-insensitive uniqueness
    seen_lower = set()
    unique: List[str] = []
    for c in candidates:
        cl = c.lower()
        if cl not in seen_lower:
            seen_lower.add(cl)
            unique.append(c)
    # Trim
    return unique[:MAX_CANDIDATES]


def detect_skills_semantic(text: str, text_embedding, threshold: float) -> List[str]:
    """Return canonical skills detected in text using substring OR semantic similarity."""
    text_lower = (text or "").lower()
    skill_embs = load_skill_embeddings()
    detected: List[str] = []
    for skill, emb in skill_embs.items():
        if skill.lower() in text_lower:
            detected.append(skill)
            continue
        try:
            sim = util.cos_sim(emb, text_embedding).item()
            if sim >= threshold:
                detected.append(skill)
        except Exception:
            continue
    # Deduplicate preserving order
    seen = set()
    unique: List[str] = []
    for s in detected:
        if s not in seen:
            seen.add(s)
            unique.append(s)
    return unique


def presence_by_similarity(
    phrases: List[str], target_embedding, threshold: float
) -> List[str]:
    """Return phrases considered present in target by embedding similarity."""
    if not phrases:
        return []
    try:
        model = get_model()
        phrase_embeddings = model.encode(phrases, convert_to_tensor=True)
        sims = util.cos_sim(phrase_embeddings, target_embedding).cpu().numpy().flatten()
        present = [p for p, s in zip(phrases, sims) if s >= threshold]
        return present
    except Exception:
        return []


def calculate_match_score(resume_text, job_description):
    try:
        resume_text = normalize(resume_text)
        job_description = normalize(job_description)
        
        print(f"DEBUG: Resume text length: {len(resume_text)}")
        print(f"DEBUG: JD text length: {len(job_description)}")

        if not resume_text:
            print("WARNING: Resume text is empty!")
        
        # Load model only when needed
        model = get_model()
        
        # Embedding-based similarity (document-level)
        resume_embedding = model.encode(resume_text, convert_to_tensor=True)
        jd_embedding = model.encode(job_description, convert_to_tensor=True)
        score = util.cos_sim(resume_embedding, jd_embedding).item()
        match_percentage = round(max(0.0, min(1.0, score)) * 100, 2)
        print(f"DEBUG: Match Score calculated: {match_percentage}")

        # Canonical skills (semantic)
        resume_skills_canonical = detect_skills_semantic(
            resume_text, resume_embedding, SKILL_IN_RESUME_THRESHOLD
        )
        jd_skills_canonical = detect_skills_semantic(
            job_description, jd_embedding, SKILL_IN_JD_THRESHOLD
        )
        print(f"DEBUG: Canonical skills found in Resume: {len(resume_skills_canonical)}")
        print(f"DEBUG: Canonical skills found in JD: {len(jd_skills_canonical)}")

        # Dynamic candidates from JD via spaCy
        jd_candidates = extract_candidates_spacy(job_description)
        print(f"DEBUG: spaCy JD candidates extracted: {len(jd_candidates)}")
        # Consider only meaningful candidates (filter overly generic)
        generic = {
            "experience",
            "skills",
            "responsibilities",
            "team",
            "project",
            "work",
            "role",
            "company",
            "job",
            "requirement",
            "requirements",
        }
        jd_candidates = [c for c in jd_candidates if c.lower() not in generic]

        # Determine which JD candidates appear in the resume semantically
        present_dynamic = presence_by_similarity(
            jd_candidates, resume_embedding, CANDIDATE_SIM_THRESHOLD
        )
        missing_dynamic = [c for c in jd_candidates if c not in present_dynamic]

        # Extract resume dynamic candidates as those JD candidates that are present
        resume_skills_dynamic = present_dynamic

        # Merge canonical and dynamic
        def merge_unique(a: List[str], b: List[str]) -> List[str]:
            seen = set()
            merged: List[str] = []
            for lst in (a, b):
                for item in lst:
                    key = item.strip()
                    if key and key not in seen:
                        seen.add(key)
                        merged.append(item)
            return merged

        extracted_skills = merge_unique(resume_skills_canonical, resume_skills_dynamic)
        # Missing: prioritize JD canonical + JD dynamic not present in extracted
        missing_skills = [
            s
            for s in merge_unique(jd_skills_canonical, jd_candidates)
            if s not in set(extracted_skills)
        ]

        # Suggestions (rule-based)
        suggestions_parts = []
        if missing_skills:
            suggestions_parts.append(
                f"Consider highlighting these areas to better match the role: {', '.join(missing_skills[:10])}{'…' if len(missing_skills) > 10 else ''}."
            )
        if match_percentage < 60:
            suggestions_parts.append(
                "Your match score is below 60%. Tailor your summary and experience bullets to reflect the job requirements more closely."
            )
        elif match_percentage < 80:
            suggestions_parts.append(
                "Good alignment. You can further improve by aligning terminology and quantifying achievements."
            )
        else:
            suggestions_parts.append(
                "Strong match. Ensure your most relevant accomplishments are prominent in the top third of your resume."
            )
        if (jd_skills_canonical or jd_candidates) and not missing_skills:
            suggestions_parts.append(
                "All key areas from the job description are covered. Great!"
            )
        suggestions = " ".join(suggestions_parts)

        return {
            "match_score": match_percentage,
            "extracted_skills": extracted_skills,
            "missing_skills": missing_skills,
            "suggestions": suggestions,
        }

    except Exception as e:
        print(f"CRITICAL ERROR in calculate_match_score: {e}")
        return {
            "match_score": 0,
            "extracted_skills": [],
            "missing_skills": [],
            "suggestions": f"Error generating score: {str(e)}",
        }
