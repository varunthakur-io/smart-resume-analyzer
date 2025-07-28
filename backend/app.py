from flask import Flask, request, jsonify
from flask_cors import CORS
import os

from utils.extractor import extract_text_from_pdf

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

    # Save resume file
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], resume.filename)
    resume.save(file_path)

    # Extract resume text
    resume_text = extract_text_from_pdf(file_path)

    # Dummy response for now
    return jsonify({
        'match_score': 78,
        'missing_skills': ['React', 'TypeScript'],
        'suggestions': 'Add more frontend projects to your resume.',
        'resume_text': resume_text[:300]  # Optional for testing/debugging
    })

if __name__ == '__main__':
    app.run(debug=True)
