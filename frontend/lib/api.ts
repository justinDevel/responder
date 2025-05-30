import { Agent, AgentResponse, Question, Conversation, BaseAgentsResponse } from "@/types/agent";
import { delay, staticAgents } from "./data";
import { formatLastUpdated } from "./utils";



export async function queryPerplexity(userInput: string, agents: Agent[]) {
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_input: userInput, main_agent_id: "coordinator-bot",  available_agents: agents }),
  });

  if (!res.ok) {
    const error = await res.json();
    console.error('Error querying backend:', error);
    throw new Error(error.detail || 'Failed to query backend');
  }

  console.log('Response from backend:', res);
  return res.json();
}



export async function askAgent(
  question: string,
  agentConfig: Agent[]
): Promise<BaseAgentsResponse> {

 
  return queryPerplexity(
    question,
    agentConfig).then(response => {
        console.log("Response from agent:", response);
    return response;
  }).catch(error => {
    console.error("Error asking agent:", error);
    return {
      agentId: "coordinator-bot",
      name: "Coordinator Bot",
      agentColor: "#F97316",
      content: "Error retrieving answer",
      citations: [],
      timestamp: new Date().toISOString()
    };
  });

}

export async function askMultipleAgents(
  question: string,
  agents: Agent[]
): Promise<Question> {
  
  const questionId = `q${Date.now()}`;
  const activeAgents = agents.filter(agent => agent.active);
  
  const pendingQuestion: Question = {
    id: questionId,
    text: question,
    timestamp: new Date().toISOString(),
    status: 'pending',
    responses: []
  };
  
  try {
    let responses: BaseAgentsResponse = {
      agent_responses: [],
      final_response: {
        agentId: 'coordinator-bot',
        name: 'Coordinator Bot',
        agentColor: '#F97316',
        content: "Processing your question...",
        citations: [],
        timestamp: new Date().toISOString()
      }
    };
    
    responses = await askAgent(question, activeAgents);
    const agentsResponses = responses.agent_responses || [];
    const finalResponse = responses.final_response || {};
    console.log("Responses from agents:", agentsResponses);
    console.log("Reponses from final response:", finalResponse);
    
    const combinedResponse: AgentResponse = {
      agentId: 'combined',
      name: 'Combined Analysis',
      agentColor: '#000000',
      content: generateCombinedResponse(finalResponse),
      citations: agentsResponses.flatMap(r => r.citations),
      timestamp: new Date().toISOString()
    };

    
    const conversation: Conversation = {
      id: `conv${Date.now()}`,
      title: question.length > 50 ? question.substring(0, 50) + '...' : question,
      timestamp: new Date().toISOString(),
      questions: [{
        ...pendingQuestion,
        status: 'completed',
        responses: [...agentsResponses, combinedResponse]
      }]
    };

    
    const history = JSON.parse(localStorage.getItem('conversationHistory') || '[]');
    localStorage.setItem('conversationHistory', JSON.stringify([conversation, ...history]));
    
    return {
      ...pendingQuestion,
      status: 'completed',
      responses: [...agentsResponses, combinedResponse]
    };
  } catch (error) {
    console.error("Error asking agents:", error);
    return {
      ...pendingQuestion,
      status: 'error',
      responses: []
    };
  }
}

function generateCombinedResponse(coordinator: AgentResponse): string {
  
  return coordinator.content || 'No combined analysis available. ';
}


export async function getAgents(): Promise<Agent[]> {
 
  await delay(500);
  
  
  const storedAgents = localStorage.getItem('agents');
  if (storedAgents) {
    return JSON.parse(storedAgents);
  }
  
  
  localStorage.setItem('agents', JSON.stringify(staticAgents));
  return [...staticAgents];
}





export async function updateAgent(agent: Agent): Promise<Agent> {
 
  
  await delay(800);
  
  const updatedAgent = {
    ...agent,
    lastUpdated: formatLastUpdated(new Date().toISOString())
  };
  
  
  const agents = JSON.parse(localStorage.getItem('agents') || '[]');
  const updatedAgents = agents.map((a: Agent) => 
    a.id === agent.id ? updatedAgent : a
  );
  localStorage.setItem('agents', JSON.stringify(updatedAgents));
  
  return updatedAgent;
}


export async function getConversationHistory(): Promise<Conversation[]> {

  return JSON.parse(localStorage.getItem('conversationHistory') || '[]');
}