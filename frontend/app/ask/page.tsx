"use client";

import { useState, useEffect } from "react";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { Agent, AgentResponse, Question } from "@/types/agent";
import { getAgents, askMultipleAgents } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { getConversationHistory } from "@/lib/api";

export default function AskPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const conversationId = searchParams.get('conversation');
  const [initialQuestion, setInitialQuestion] = useState<string | null>(null);
  const [cHistoryResponse, setCHistoryResponse] = useState<Question[]>([]);

  useEffect(() => {
    
    const loadAgents = async () => {
      try {
        const data = await getAgents();
        setAgents(data);
      } catch (error) {
        console.error("Error loading agents:", error);
      } finally {
        setLoading(false);
      }
    };

    const loadConversation = async () => {
      if (conversationId) {
        try {
          const history = await getConversationHistory();
          const conversation = history.find(conv => conv.id === conversationId);
          if (conversation && conversation.questions.length > 0) {
            setCHistoryResponse(conversation.questions);
            setInitialQuestion(conversation.questions[0].text);
          }
          console.log("Conversation History Response:", cHistoryResponse);
          console.log("Loaded conversation:", conversation);
        } catch (error) {
          console.error("Error loading conversation:", error);
        }
      }
    };

    loadAgents();
    loadConversation();
  }, [conversationId]);

  const handleSubmitQuestion = async (question: string) => {
    return await askMultipleAgents(question, agents);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b bg-card px-6 py-4">
        <h1 className="text-2xl font-bold">Ask Your Agents</h1>
        <p className="text-sm text-muted-foreground">
          {agents.filter(a => a.active).length} active agents ready to research
        </p>
      </div>
      
      <div className="flex-1">
        <ChatInterface 
          onSubmitQuestion={handleSubmitQuestion} 
          hConversations={cHistoryResponse}
          initialQuestion={initialQuestion}
          agents={agents}
        />
      </div>
    </div>
  );
}