# matcher.py

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re

def clean_text(text):
    text = re.sub(r'[^a-zA-Z ]', '', text)
    return text.lower()

def calculate_match_score(resume_text, job_description):
    resume_clean = clean_text(resume_text)
    jd_clean = clean_text(job_description)

    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([resume_clean, jd_clean])

    score = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]
    match_percentage = round(score * 100, 2)

    return {
        "match_score": match_percentage,
        "suggestions": "Try to tailor your resume more closely to the job description.",
        "missing_skills": []  # We’ll fill this in later
    }
