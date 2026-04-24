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
    """Lazily loads the SentenceTransformer model to save memory on startup."""
    global _model
    if _model is None:
        print("DEBUG: Loading SentenceTransformer model (all-MiniLM-L6-v2)...")
        _model = SentenceTransformer("all-MiniLM-L6-v2")
        print("DEBUG: Model loaded successfully.")
    return _model


# Load spaCy model once
@lru_cache(maxsize=1)
def get_nlp():
    """Lazily loads the spaCy NLP model for entity and noun chunk extraction."""
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

ACTION_VERBS = [
    "achieved", "acquired", "adapted", "addressed", "administered", "advised", "allocated", "analyzed", "anticipated", "applied",
    "approved", "arranged", "assessed", "assigned", "assisted", "attained", "audited", "authored", "automated", "balanced",
    "budgeted", "built", "calculated", "captured", "chaired", "clarified", "classified", "closed", "coached", "collaborated",
    "collected", "combined", "communicated", "completed", "computed", "conceptualized", "conducted", "consolidated", "constructed", "consulted",
    "contracted", "contributed", "controlled", "converted", "coordinated", "corresponded", "counseled", "created", "critiqued", "cultivated",
    "customized", "debugged", "decided", "defined", "delegated", "delivered", "demonstrated", "designed", "detailed", "determined",
    "developed", "devised", "diagnosed", "directed", "discovered", "displayed", "distributed", "documented", "doubled", "drafted",
    "edited", "educated", "effected", "elicited", "eliminated", "emphasized", "enabled", "enacted", "encouraged", "endured",
    "enforced", "engineered", "enhanced", "enlarged", "enlisted", "ensured", "entered", "established", "estimated", "evaluated",
    "examined", "exceeded", "executed", "exercised", "expanded", "expedited", "experimented", "explained", "explored", "expressed",
    "extended", "extracted", "fabricated", "facilitated", "familiarized", "fashioned", "filed", "finalized", "financed", "fitted",
    "focused", "forecasted", "formulated", "fostered", "found", "founded", "framed", "fulfilled", "functioned", "furnished",
    "gained", "gathered", "generated", "governed", "graduated", "granted", "grouped", "guided", "handled", "helped",
    "identified", "illuminated", "illustrated", "implemented", "improved", "improvised", "inaugurated", "indoctrinated", "increased", "indexed",
    "indicated", "individualized", "influenced", "informed", "initiated", "innovated", "inspected", "inspired", "installed", "instigated",
    "instilled", "instituted", "instructed", "insured", "integrated", "interacted", "interpreted", "intervened", "interviewed", "introduced",
    "invented", "inventoried", "investigated", "involved", "isolated", "issued", "joined", "judged", "justified", "kept",
    "launched", "learned", "lectured", "led", "licensed", "listened", "located", "logged", "maintained", "managed",
    "manipulated", "manufactured", "mapped", "marketed", "mastered", "maximized", "measured", "mediated", "mentored", "merged",
    "met", "minimized", "modeled", "moderated", "modernized", "modified", "monitored", "motivated", "moved", "multiplied",
    "navigated", "negotiated", "noted", "notified", "observed", "obtained", "offered", "offset", "opened", "operated",
    "orchestrated", "ordered", "organized", "oriented", "originated", "outlined", "overcame", "overhauled", "oversaw", "participated",
    "perceived", "performed", "persuaded", "photographed", "piloted", "planned", "played", "predicted", "prepared", "prescribed",
    "presented", "presided", "prevented", "printed", "prioritized", "processed", "produced", "programmed", "projected", "promoted",
    "proofread", "proposed", "protected", "proved", "provided", "publicized", "published", "purchased", "qualified", "quantified",
    "queried", "questioned", "raised", "ran", "rated", "reached", "read", "realigned", "reasoned", "received",
    "recognized", "recommended", "reconciled", "recorded", "recruited", "rectified", "redesigned", "reduced", "referred", "refined",
    "refocused", "regulated", "rehabilitated", "reinforced", "reiterated", "rejected", "related", "released", "relied", "remanufactured",
    "remodeled", "rendered", "renewed", "renovated", "reorganized", "repaired", "replaced", "replied", "reported", "represented",
    "researched", "resolved", "responded", "restored", "restructured", "retrieved", "revamped", "revealed", "reviewed", "revised",
    "revitalized", "rewarded", "routed", "saved", "scheduled", "screened", "scrutinized", "searched", "secured", "selected",
    "served", "serviced", "settled", "shaped", "shared", "showed", "simplified", "simulated", "sketched", "sold",
    "solved", "sorted", "spearheaded", "specialized", "specified", "spoke", "sponsored", "staffed", "standardized", "started",
    "stimulated", "strategized", "streamlined", "strengthened", "stressed", "stretched", "structured", "studied", "submitted", "substituted",
    "succeeded", "suggested", "summarized", "supervised", "supplied", "supported", "surpassed", "surveyed", "synchronized", "synthesized",
    "systematized", "tabulated", "tailored", "targeted", "taught", "teamed", "tested", "testified", "tightened", "took",
    "totaled", "traced", "tracked", "traded", "trained", "transcribed", "transferred", "transformed", "translated", "transmitted",
    "transported", "traveled", "treated", "triggered", "trimmed", "tripled", "troubleshot", "turned", "tutored", "typed",
    "umpired", "uncovered", "understood", "understudied", "undertook", "underwrote", "unified", "united", "unraveled", "updated",
    "upgraded", "upheld", "used", "utilized", "validated", "valued", "verified", "viewed", "visited", "visualized",
    "voiced", "volunteered", "waited", "walked", "wanted", "warned", "washed", "watched", "weighted", "welcomed",
    "won", "worked", "wrote"
]

@lru_cache(maxsize=1)
def load_skills_list() -> List[str]:
    """Loads the canonical skills list from a text file or returns a fallback set."""
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
        skills = ["Python", "JavaScript", "React", "TypeScript", "HTML", "CSS", "Flask", "Django", "SQL", "REST API"]
    return skills


@lru_cache(maxsize=1)
def load_skill_embeddings() -> Dict[str, List[float]]:
    """Generates and caches embeddings for the canonical skills list."""
    skills = load_skills_list()
    model = get_model()
    embeddings = model.encode(skills, convert_to_tensor=True)
    return {skill: embeddings[i] for i, skill in enumerate(skills)}


def normalize(text: str) -> str:
    """Standardizes text by removing redundant whitespace."""
    return re.sub(r"\s+", " ", text or "").strip()


def cleanup_phrase(text: str) -> str:
    """Cleans up extracted noun chunks by removing punctuation and extra whitespace."""
    t = re.sub(r"[\s\-_/]+", " ", text or "").strip()
    t = t.strip(".,;:!()[]{}\"'`~")
    return t


def extract_candidates_spacy(text: str) -> List[str]:
    """Extracts noun chunks and significant nouns from text using spaCy."""
    nlp = get_nlp()
    if not text: return []
    try:
        doc = nlp(text)
    except Exception: return []

    candidates: List[str] = []
    for chunk in doc.noun_chunks:
        phrase = cleanup_phrase(chunk.text)
        if len(phrase) >= MIN_CANDIDATE_LEN: candidates.append(phrase)
    for tok in doc:
        if tok.is_stop or tok.is_punct or tok.like_num: continue
        if tok.pos_ in ("PROPN", "NOUN"):
            phrase = cleanup_phrase(tok.text)
            if len(phrase) >= MIN_CANDIDATE_LEN: candidates.append(phrase)

    seen_lower = set()
    unique: List[str] = []
    for c in candidates:
        cl = c.lower()
        if cl not in seen_lower:
            seen_lower.add(cl)
            unique.append(c)
    return unique[:MAX_CANDIDATES]


def detect_skills_semantic(text: str, text_embedding, threshold: float) -> List[str]:
    """Identifies canonical skills in text using either exact substring matches or semantic similarity."""
    text_lower = (text or "").lower()
    skill_embs = load_skill_embeddings()
    detected: List[str] = []
    for skill, emb in skill_embs.items():
        if skill.lower() in text_lower:
            detected.append(skill)
            continue
        try:
            sim = util.cos_sim(emb, text_embedding).item()
            if sim >= threshold: detected.append(skill)
        except Exception: continue
    
    seen = set()
    unique: List[str] = []
    for s in detected:
        if s not in seen:
            seen.add(s)
            unique.append(s)
    return unique


def presence_by_similarity(phrases: List[str], target_embedding, threshold: float) -> List[str]:
    """Determines if a list of phrases is semantically present in a target document."""
    if not phrases: return []
    try:
        model = get_model()
        phrase_embeddings = model.encode(phrases, convert_to_tensor=True)
        sims = util.cos_sim(phrase_embeddings, target_embedding).cpu().numpy().flatten()
        present = [p for p, s in zip(phrases, sims) if s >= threshold]
        return present
    except Exception: return []


def calculate_match_score(resume_text, job_description):
    """Calculates a percentage match score with detailed sub-score breakdown."""
    try:
        resume_text = normalize(resume_text)
        job_description = normalize(job_description)
        
        if not resume_text: return {"match_score": 0, "extracted_skills": [], "missing_skills": [], "suggestions": "Empty resume."}

        model = get_model()
        resume_embedding = model.encode(resume_text, convert_to_tensor=True)
        jd_embedding = model.encode(job_description, convert_to_tensor=True)

        # 1. Semantic Match (The "Brain" score)
        semantic_score = util.cos_sim(resume_embedding, jd_embedding).item()
        semantic_score = round(max(0.0, min(1.0, semantic_score)) * 100, 2)

        # 2. Keyword Match (The "ATS" score)
        resume_skills_canonical = detect_skills_semantic(resume_text, resume_embedding, SKILL_IN_RESUME_THRESHOLD)
        jd_skills_canonical = detect_skills_semantic(job_description, jd_embedding, SKILL_IN_JD_THRESHOLD)
        jd_candidates = extract_candidates_spacy(job_description)
        
        # Filter generic keywords
        generic = {"experience", "skills", "responsibilities", "team", "project", "work", "role", "company", "job", "requirement", "requirements"}
        jd_candidates = [c for c in jd_candidates if c.lower() not in generic]

        present_dynamic = presence_by_similarity(jd_candidates, resume_embedding, CANDIDATE_SIM_THRESHOLD)
        
        # Merge skills
        def merge(a, b):
            seen = set()
            return [x for x in a + b if x.strip() and not (x.strip() in seen or seen.add(x.strip()))]

        extracted_skills = merge(resume_skills_canonical, present_dynamic)
        all_required = merge(jd_skills_canonical, jd_candidates)
        missing_skills = [s for s in all_required if s not in set(extracted_skills)]

        keyword_score = round((len(extracted_skills) / max(len(all_required), 1)) * 100, 2)

        # 3. Action Verbs (The "Impact" score)
        found_verbs = [v for v in ACTION_VERBS if f" {v} " in f" {resume_text.lower()} "]
        action_score = round(min(len(found_verbs) / 15.0, 1.0) * 100, 2)

        # 4. Formatting Score (The "Professionalism" score)
        formatting_score = 100
        if len(resume_text) < 500: formatting_score -= 30  # Too short
        if not re.search(r'[\w\.-]+@[\w\.-]+', resume_text): formatting_score -= 20  # No email
        if not re.search(r'linkedin\.com', resume_text.lower()): formatting_score -= 10 # No LinkedIn

        # Calculate weighted overall score
        # Weighting: 40% Semantic, 30% Keywords, 20% Action Verbs, 10% Formatting
        match_percentage = round(
            (semantic_score * 0.4) + 
            (keyword_score * 0.3) + 
            (action_score * 0.2) + 
            (formatting_score * 0.1), 
            2
        )

        # Generate suggestions
        suggestions_parts = []
        if action_score < 60: suggestions_parts.append("Use more strong action verbs (e.g., 'Led', 'Developed', 'Optimized') to describe your achievements.")
        if keyword_score < 60: suggestions_parts.append(f"Try to incorporate these specific keywords from the JD: {', '.join(missing_skills[:5])}.")
        if formatting_score < 90: suggestions_parts.append("Ensure your contact information and professional links (LinkedIn) are clearly visible.")
        
        suggestions = " ".join(suggestions_parts) if suggestions_parts else "Your resume is well-optimized for this role."

        return {
            "match_score": match_percentage,
            "extracted_skills": extracted_skills,
            "missing_skills": missing_skills,
            "suggestions": suggestions,
            "breakdown": {
                "Semantic": semantic_score,
                "Keywords": keyword_score,
                "Action Verbs": action_score,
                "Formatting": formatting_score
            }
        }

    except Exception as e:
        print(f"CRITICAL ERROR in calculate_match_score: {e}")
        return {"match_score": 0, "extracted_skills": [], "missing_skills": [], "suggestions": f"Error: {str(e)}"}
