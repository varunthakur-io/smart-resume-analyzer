import re
from sentence_transformers import SentenceTransformer, util

# Load model only once
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

def clean_text(text):
    text = re.sub(r'[^a-zA-Z ]', '', text)
    return text.lower()

def calculate_match_score(resume_text, job_description):
    try:
        # ✅ Generate embeddings using local MiniLM model
        resume_embedding = model.encode(resume_text, convert_to_tensor=True)
        jd_embedding = model.encode(job_description, convert_to_tensor=True)

        # ✅ Compute cosine similarity
        score = util.cos_sim(resume_embedding, jd_embedding).item()
        match_percentage = round(score * 100, 2)

        return {
            "match_score": match_percentage,
            "suggestions": "Score calculated using local semantic embeddings with MiniLM (sentence-transformers)."
        }

    except Exception as e:
        return {
            "match_score": 0,
            "suggestions": f"Error generating score: {str(e)}"
        }
