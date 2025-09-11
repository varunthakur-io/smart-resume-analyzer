from flask import Flask, request, jsonify
from flask_cors import CORS

import os
import uuid
import json

from utils.extractor import extract_text_from_pdf
from utils.matcher import calculate_match_score

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def home():
    return 'Smart Resume Analyzer API is running.'

@app.route('/analyze', methods=['POST'])
def analyze_resume():
    if 'resume' not in request.files:
        return jsonify({'error': 'No resume file provided'}), 400

    resume = request.files['resume']
    job_description = request.form.get('job_description')

    if not job_description:
        return jsonify({'error': 'Job description is missing'}), 400


    # Save resume file with unique ID
    analysis_id = str(uuid.uuid4())
    safe_filename = f"{analysis_id}_{resume.filename}"
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], safe_filename)
    resume.save(file_path)

    # Extract resume text
    resume_text = extract_text_from_pdf(file_path)

    # Calculate match score
    match_result = calculate_match_score(resume_text, job_description)

    # Store analysis result as JSON
    analyses_dir = os.path.join(os.path.dirname(__file__), 'analyses')
    os.makedirs(analyses_dir, exist_ok=True)
    analysis_data = {
        'id': analysis_id,
        'resume_name': resume.filename,
        'resume_file': safe_filename,
        'match_score': match_result.get('match_score'),
        'extracted_skills': match_result.get('extracted_skills', []),
        'missing_skills': match_result.get('missing_skills', []),
        'suggestions': match_result.get('suggestions', ''),
    }
    with open(os.path.join(analyses_dir, f'{analysis_id}.json'), 'w', encoding='utf-8') as f:
        json.dump(analysis_data, f)

    # Return the match result and analysis id
    return jsonify({
        **match_result,
        'id': analysis_id,
        'resume_name': resume.filename,
        'resume_file': safe_filename,
    })

# Endpoint to list all analyses
@app.route('/analyses', methods=['GET'])
def list_analyses():
    analyses_dir = os.path.join(os.path.dirname(__file__), 'analyses')
    if not os.path.exists(analyses_dir):
        return jsonify([])
    analyses = []
    for fname in os.listdir(analyses_dir):
        if fname.endswith('.json'):
            with open(os.path.join(analyses_dir, fname), encoding='utf-8') as f:
                try:
                    data = json.load(f)
                    analyses.append(data)
                except Exception:
                    continue
    return jsonify(analyses)

# Endpoint to delete an analysis and its resume file
@app.route('/analyses/<analysis_id>', methods=['DELETE'])
def delete_analysis(analysis_id):
    analyses_dir = os.path.join(os.path.dirname(__file__), 'analyses')
    analysis_path = os.path.join(analyses_dir, f'{analysis_id}.json')
    if not os.path.exists(analysis_path):
        return jsonify({'error': 'Analysis not found'}), 404
    # Remove resume file if exists
    with open(analysis_path, encoding='utf-8') as f:
        data = json.load(f)
        resume_file = data.get('resume_file')
        if resume_file:
            resume_path = os.path.join(app.config['UPLOAD_FOLDER'], resume_file)
            if os.path.exists(resume_path):
                os.remove(resume_path)
    os.remove(analysis_path)
    return jsonify({'success': True})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')

