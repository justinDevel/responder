import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PERPLEXITY_API_KEY: str = os.getenv("PERPLEXITY_API_KEY")
    PERPLEXITY_API_URL: str = os.getenv("PERPLEXITY_API_URL", "https://api.perplexity.ai/v1/chat/completions")

settings = Settings()
