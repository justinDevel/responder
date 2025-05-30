import httpx
from app.core.config import settings
from app.models.agent import Agent
from app.utils.logger import get_logger
import requests

logger = get_logger("PerplexityService")

async def query_perplexity(agent: Agent, question: str) -> str:
    payload = {
        "model": "sonar",
        "messages": [
            {"role": "system", "content": agent.prompt},
            {"role": "user", "content": question}
        ],
        "max_tokens": 256,
        "temperature": 0.2,
        "top_p": 0.9,
        "return_images": False,
        "return_related_questions": False,
        "top_k": 3,
        "stream": False,
        "presence_penalty": 0,
        "frequency_penalty": 0,
    
        "web_search_options": {"search_context_size": "low"}
    }

    headers = {
        "Authorization": f"Bearer {settings.PERPLEXITY_API_KEY}",
        "Content-Type": "application/json"
    }


    # print(response.text)
    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            logger.info(f'payload: {payload}')
            response = await client.post(settings.PERPLEXITY_API_URL, json=payload, headers=headers)
            response.raise_for_status()
            json_resp = response.json()
            logger.info(f"Perplexity response for agent {agent.id}: {json_resp}")
            return parse_perplexity_response(json_resp)
        except Exception as e:
            logger.error(f"Error from Perplexity API for agent {agent.id}: {e}")
            return f"Error: {str(e)}"


def parse_perplexity_response(json_resp: dict) -> dict:
    choice = json_resp.get("choices", [{}])[0]
    message = choice.get("message", {})
    content = message.get("content", "")
    citations = json_resp.get("citations", [])

    return {
        "content": content,
        "citations": citations
    }
