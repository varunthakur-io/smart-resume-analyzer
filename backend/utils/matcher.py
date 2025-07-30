import re
import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

nlp = spacy.load("en_core_web_sm")

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

def extract_skills_with_nlp(text, known_skills):
    doc = nlp(text)
    found_skills = set()

    for chunk in doc.noun_chunks:
        chunk_text = chunk.text.strip().lower()
        if chunk_text in known_skills:
            found_skills.add(chunk_text)

    for ent in doc.ents:
        ent_text = ent.text.strip().lower()
        if ent_text in known_skills:
            found_skills.add(ent_text)

    return list(found_skills)

def calculate_match_score(resume_text, job_description):
    resume_clean = clean_text(resume_text)
    jd_clean = clean_text(job_description)

    # TF-IDF similarity
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([resume_clean, jd_clean])
    score = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]
    match_percentage = round(score * 100, 2)

    # Smart skill extraction
    known_skills = load_skills()
    extracted_skills = extract_skills_with_nlp(resume_text, known_skills)
    missing_skills = [skill for skill in known_skills if skill not in extracted_skills]

    return {
        "match_score": match_percentage,
        "extracted_skills": extracted_skills,
        "missing_skills": missing_skills,
        "suggestions": "Include more relevant skills found in the job description."
    }
