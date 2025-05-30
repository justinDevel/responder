from app.models.agent import AgentQuery
from app.utils.perplexity_client import query_perplexity
from app.utils.logger import logger  
from jinja2 import Environment, FileSystemLoader, TemplateError, select_autoescape
from typing import Dict


env = Environment(
    loader=FileSystemLoader("app/templates/"),
    autoescape=select_autoescape()
)


async def process_query(request: AgentQuery) -> Dict:
    try:
        user_input = request.user_input
        agents = request.available_agents
        main_agent_id = request.main_agent_id

        if not agents:
            raise ValueError("No available agents provided.")


        agent_responses = []

        for agent in agents:
            if agent.id == main_agent_id:
                continue  

            try:
                prompt = env.get_template("agent_template.jinja2").render(
                    agent_name=agent.name,
                    agent_prompt=agent.prompt,
                    role=agent.role,
                    user_input=user_input
                )

                logger.info(f"Rendering prompt for agent '{agent.id}': {prompt}")
            except TemplateError as e:
                logger.error(f"Template rendering failed for agent '{agent.id}': {str(e)}")
                continue  

            messages = [
                {"role": "system", "content": prompt},
                {"role": "user", "content": user_input}
            ]

            logger.info(f"Querying Perplexity for agent '{agent.id}' with messages: {messages}")
            try:
                response = await query_perplexity(messages)
                logger.info(f"Received response from Perplexity for agent '{agent.id}': {response}")
            except Exception as e:
                logger.error(f"Perplexity API call failed for agent '{agent.id}': {str(e)}")
                continue

            agent_responses.append({
                "id": agent.id,
                "role": agent.role,
                "name": agent.name,
                "content": response.get("content", ""),
                "citations": response.get("citations", [])
            })

        
        context = "\n\n".join([f"{r['role']}: {r['content']}" for r in agent_responses])

        try:
            coordinator_prompt = env.get_template("base_prompt.jinja2").render(
                user_input=user_input,
                agent_responses=context
            )

            logger.info(f"Rendering main coordinator prompt: {coordinator_prompt}")
        except TemplateError as e:
            logger.error(f"Main coordinator prompt rendering failed: {str(e)}")
            raise

        final_messages = [
            {"role": "system", "content": coordinator_prompt},
            {"role": "user", "content": user_input}
        ]

        try:
            final_response = await query_perplexity(final_messages)
        except Exception as e:
            # logger.error(f"Perplexity API call failed for main agent '{main_agent.id}': {str(e)}")
            raise

        return {
            "agent_responses": agent_responses,
            "final_response": {
                "id": "coordinator-bot",
                "role": "coordinator",
                "name": "Coordinator Bot",
                "content": final_response.get("content", ""),
                "citations": final_response.get("citations", [])
            }
        }

    except Exception as e:
        logger.exception("Unexpected error in process_query")
        return {
            "error": "Internal Server Error",
            "detail": str(e)
        }
