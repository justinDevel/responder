import os
from app.utils import logger
import httpx
from app.core.config import settings


API_URL = settings.PERPLEXITY_API_URL
PERPLEXITY_API_KEY = settings.PERPLEXITY_API_KEY

async def query_perplexity(messages: list) -> str:
    headers = {
        "Authorization": f"Bearer {PERPLEXITY_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "sonar",
        "messages": messages,
        "max_tokens": 300,
        "temperature": 0.3,
        "top_p": 0.9,
        "web_search_options": {"search_context_size": "low"},
        "stream": False
    }

    async with httpx.AsyncClient(timeout=20.0) as client:
        response = await client.post(API_URL, json=payload, headers=headers)
        response.raise_for_status()
        data = response.json()
        logger.info(f"Perplexity response: {data}")
        return parse_perplexity_response(data)
        


def parse_perplexity_response(json_resp: dict) -> dict:
    choice = json_resp.get("choices", [{}])[0]
    message = choice.get("message", {})
    content = message.get("content", "")
    citations = json_resp.get("citations", [])

    return {
        "content": content,
        "citations": citations
    }