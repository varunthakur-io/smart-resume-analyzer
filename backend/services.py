import json
import os
import uuid
from pathlib import Path
from typing import Any, Dict, List, Optional

from config import ANALYSES_DIR, UPLOADS_DIR
from utils.extractor import extract_text
from utils.matcher import calculate_match_score


class AnalysisService:
    """
    Handles the lifecycle of a resume analysis, including file storage,
    text extraction, semantic matching, and persistence of results.
    """
    def __init__(
        self, analyses_dir: Path = ANALYSES_DIR, uploads_dir: Path = UPLOADS_DIR
    ):
        self.analyses_dir = analyses_dir
        self.uploads_dir = uploads_dir

    def analyze(self, resume_file, job_description: str) -> Dict[str, Any]:
        """
        Processes a single resume against a job description.
        Saves the file, extracts text, calculates scores, and persists the result.
        """
        if resume_file is None:
            raise ValueError("No resume file provided")
        if not job_description:
            raise ValueError("Job description is missing")

        analysis_id = str(uuid.uuid4())
        safe_filename = f"{analysis_id}_{resume_file.filename}"
        file_path = self.uploads_dir / safe_filename
        resume_file.save(str(file_path))

        # Use the generic extract_text function to support PDF, DOCX, TXT
        resume_text = extract_text(str(file_path))
        match_result = calculate_match_score(resume_text, job_description)

        doc = {
            "id": analysis_id,
            "resume_name": resume_file.filename,
            "resume_file": safe_filename,
            "match_score": match_result.get("match_score", 0),
            "extracted_skills": match_result.get("extracted_skills", []),
            "missing_skills": match_result.get("missing_skills", []),
            "suggestions": match_result.get("suggestions", ""),
            "breakdown": match_result.get("breakdown", {})
        }
        self._save_doc(doc)

        response = {
            **match_result,
            "id": analysis_id,
            "resume_name": resume_file.filename,
            "resume_file": safe_filename,
        }
        return response

    def list(self) -> List[Dict[str, Any]]:
        """Lists all existing analysis JSON records from the storage directory."""
        items: List[Dict[str, Any]] = []
        for fname in os.listdir(self.analyses_dir):
            if not fname.endswith(".json"):
                continue
            try:
                with open(self.analyses_dir / fname, encoding="utf-8") as f:
                    items.append(json.load(f))
            except Exception:
                continue
        return items

    def delete(self, analysis_id: str) -> bool:
        """Removes an analysis record and its associated resume PDF from disk."""
        path = self.analyses_dir / f"{analysis_id}.json"
        if not path.exists():
            return False
        try:
            with open(path, encoding="utf-8") as f:
                data = json.load(f)
            resume_file = data.get("resume_file")
            if resume_file:
                rf = self.uploads_dir / resume_file
                if rf.exists():
                    rf.unlink()
            path.unlink()
            return True
        except Exception:
            return False

    def delete_resume_only(self, analysis_id: str) -> bool:
        """Deletes the PDF file for an analysis while keeping the JSON result metadata."""
        path = self.analyses_dir / f"{analysis_id}.json"
        if not path.exists():
            return False
        try:
            with open(path, encoding="utf-8") as f:
                data = json.load(f)
            resume_file = data.get("resume_file")
            if resume_file:
                rf = self.uploads_dir / resume_file
                if rf.exists():
                    rf.unlink()
            # Remove reference from stored JSON
            data["resume_file"] = None
            with open(path, "w", encoding="utf-8") as f:
                json.dump(data, f)
            return True
        except Exception:
            return False

    def _save_doc(self, doc: Dict[str, Any]):
        """Internal helper to persist analysis results as JSON files."""
        out = self.analyses_dir / f"{doc['id']}.json"
        with open(out, "w", encoding="utf-8") as f:
            json.dump(doc, f)
