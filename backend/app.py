from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

from config import HOST, PORT, DEBUG, CORS_ORIGINS
from services import AnalysisService

app = Flask(__name__)
CORS(app, resources={r"*": {"origins": CORS_ORIGINS}})

# Logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s"
)
logger = logging.getLogger("smart-resume-analyzer")

service = AnalysisService()


@app.get("/")
def root():
    return jsonify({"status": "ok", "service": "Smart Resume Analyzer API"})


@app.get("/healthz")
def healthz():
    return jsonify({"ok": True})


@app.post("/analyze")
def analyze_resume():
    try:
        if "resume" not in request.files:
            return jsonify({"error": "No resume file provided"}), 400
        resume = request.files["resume"]
        job_description = request.form.get("job_description", "")
        result = service.analyze(resume, job_description)
        return jsonify(result)
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        logger.exception("/analyze failed")
        return jsonify({"error": "Internal server error"}), 500


@app.get("/analyses")
def list_analyses():
    try:
        return jsonify(service.list())
    except Exception:
        return jsonify([])


@app.delete("/analyses/<analysis_id>")
def delete_analysis(analysis_id):
    try:
        ok = service.delete(analysis_id)
        if not ok:
            return jsonify({"error": "Analysis not found"}), 404
        return jsonify({"success": True})
    except Exception:
        return jsonify({"error": "Internal server error"}), 500


@app.delete("/resumes/<analysis_id>")
def delete_resume_only(analysis_id):
    try:
        ok = service.delete_resume_only(analysis_id)
        if not ok:
            return jsonify({"error": "Resume or analysis not found"}), 404
        return jsonify({"success": True})
    except Exception:
        return jsonify({"error": "Internal server error"}), 500


if __name__ == "__main__":
    app.run(debug=DEBUG, host=HOST, port=PORT)
