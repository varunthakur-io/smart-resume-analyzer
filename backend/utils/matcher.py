import os
import re
from dotenv import load_dotenv
from sklearn.metrics.pairwise import cosine_similarity
from .openai_embedder import get_embedding

load_dotenv()

def clean_text(text):
    text = re.sub(r'[^a-zA-Z ]', '', text)
    return text.lower()

def calculate_match_score(resume_text, job_description):
    try:
        # ✅ Get OpenAI embeddings
        resume_embedding = get_embedding(resume_text)
        jd_embedding = get_embedding(job_description)

        # ✅ Cosine similarity between the vectors
        score = cosine_similarity([resume_embedding], [jd_embedding])[0][0]
        match_percentage = round(score * 100, 2)

        return {
            "match_score": match_percentage,
            "suggestions": "This score is based on semantic similarity using OpenAI embeddings.",
        }

    except Exception as e:
        return {
            "match_score": 0,
            "suggestions": f"Error generating score: {str(e)}"
        }
