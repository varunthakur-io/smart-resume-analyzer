import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def clean_text(text):
    text = re.sub(r'[^a-zA-Z ]', '', text)
    return text.lower()

def load_skills():
    try:
        with open('data/skills.txt', 'r') as file:
            skills = [line.strip().lower() for line in file]
        return skills
    except:
        return []

def find_missing_skills(resume_text, skills_list):
    resume_words = set(clean_text(resume_text).split())
    missing = [skill for skill in skills_list if skill.lower() not in resume_words]
    return missing

def calculate_match_score(resume_text, job_description):
    resume_clean = clean_text(resume_text)
    jd_clean = clean_text(job_description)

    # TF-IDF similarity
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([resume_clean, jd_clean])
    score = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]
    match_percentage = round(score * 100, 2)

    # Load skills & find what's missing
    all_skills = load_skills()
    missing_skills = find_missing_skills(resume_text, all_skills)

    return {
        "match_score": match_percentage,
        "missing_skills": missing_skills,
        "suggestions": "Try to include more relevant skills in your resume."
    }
