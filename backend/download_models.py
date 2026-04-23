import os
from sentence_transformers import SentenceTransformer

def download_models():
    print("Pre-downloading sentence-transformer model...")
    model_name = "all-MiniLM-L6-v2"
    # This will download the model to the default cache directory (~/.cache/huggingface/hub)
    # Render preserves the build environment, so this will be included in the final image.
    SentenceTransformer(model_name)
    print("Model downloaded successfully!")

if __name__ == "__main__":
    download_models()
