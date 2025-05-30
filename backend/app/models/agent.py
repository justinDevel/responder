from pydantic import BaseModel
from typing import List

class Agent(BaseModel):
    id: str
    name: str
    prompt: str
    role: str = "agent"

class AgentQuery(BaseModel):
    user_input: str
    available_agents: List[Agent]
    main_agent_id: str = "main"
    main_agent_prompt: str = "You are the main agent responsible for coordinating the response."
    main_agent_name: str = "Main Agent"