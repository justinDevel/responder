from app.utils.perplexity_client import query_perplexity
from fastapi import APIRouter, HTTPException
from app.models.agent import AgentQuery
from app.services.agent_service import process_query


router = APIRouter()


@router.post("/ask", summary="Ask a question to multiple agents and get coordinated response")
async def ask_agents(query: AgentQuery):
    try:
        result = await process_query(query)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))