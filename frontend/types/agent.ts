export type Agent = {
  id: string;
  name: string;
  role: string;
  color: string;
  avatar: string;
  active: boolean;
  lastUpdated: string;
  prompt?: string;
  expertise?: string[];
  confidence?: number;
  responseTime?: number;
  successRate?: number;
  specializations?: string[];
  learningRate?: number;
  feedbackScore?: number;
};

export type BaseAgentsResponse = {
  agent_responses: AgentResponse[];
  final_response: AgentResponse
}

export type AgentResponse = {
  id?: string;
  agentId: string;
  name: string;
  answer?: string;
  citations: string[];
  timestamp: string;
  agentColor?: string;
  confidence?: number;
  processingTime?: number;
  sources?: {
    title: string;
    url: string;
    relevance: number;
  }[];
  tags?: string[];
  sentiment?: 'positive' | 'neutral' | 'negative';
  keyInsights?: string[];
  content: string;
};

export type Question = {
  id: string;
  text: string;
  timestamp: string;
  responses: AgentResponse[];
  status: 'pending' | 'completed' | 'error';
  category?: string;
  priority?: number;
  complexity?: 'low' | 'medium' | 'high';
  tags?: string[];
  aiSummary?: string;
  collaborators?: string[];
};

export type Conversation = {
  id: string;
  title: string;
  timestamp: string;
  questions: Question[];
  summary?: string;
  tags?: string[];
  duration?: number;
  agentsInvolved?: string[];
  sharedWith?: string[];
  exportFormat?: 'pdf' | 'docx' | 'md';
  analytics?: {
    totalQuestions: number;
    avgResponseTime: number;
    topAgents: string[];
    complexityScore: number;
  };
};