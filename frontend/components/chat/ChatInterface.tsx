"use client";

import { Agent, AgentResponse, Question } from "@/types/agent";
import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Bot } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChatBubble } from "./ChatBubble";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip } from "@/components/ui/tooltip";
import { Loader2 } from "lucide-react";

interface ChatInterfaceProps {
  onSubmitQuestion: (question: string) => Promise<Question>;
  hConversations?: Question[];
  initialQuestion?: string | null;
  agents?: Agent[];
}

export function ChatInterface({ 
  onSubmitQuestion,
  hConversations = [],
  initialQuestion,
  agents = [], 
}: ChatInterfaceProps) {
  const [question, setQuestion] = useState(initialQuestion || "");
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [suggestions] = useState([
    "There's a car crash outside my house. I hear people shouting and someone looks hurt.",
    "There’s flooding in our basement, and our street is completely submerged.",
    "I smell gas in my apartment and my carbon monoxide detector just went off.",
    "My grandfather fell and he can’t stand. He says his hip hurts.",
  ]);

  useEffect(() => {
    if (initialQuestion) {
      handleSubmit(new Event('submit') as any);
    }
  }, [initialQuestion]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentQuestion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim() || loading) return;
    
    setLoading(true);
    setCurrentQuestion({
      id: "pending",
      text: question,
      timestamp: new Date().toISOString(),
      status: "pending",
      responses: [],
    });
    
    try {
    
      
      const result = hConversations.length > 0 ? hConversations[0] : await onSubmitQuestion(question);
      
      const combinedAnalysis = result.responses.find(r => r.agentId === 'combined');
      const otherResponses = result.responses.filter(r => r.agentId !== 'combined');
      
      setCurrentQuestion({
        ...result,
        responses: [...otherResponses, ...(combinedAnalysis ? [combinedAnalysis] : [])]
      });
    } catch (error) {
      console.error("Error submitting question:", error);
    } finally {
      setLoading(false);
      setQuestion("");
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuestion(suggestion);
  };

  const getExpectedAgentCount = () => {
    if (!currentQuestion) return 0;
    if (currentQuestion.status === "completed") return 0;
    const activeAgents = agents.filter(a => a.active).length
    return activeAgents > 0 ? activeAgents : 1; 
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence>
          {!currentQuestion ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex h-full flex-col items-center justify-center text-center text-muted-foreground"
            >
              <div className="mb-4 rounded-full bg-primary/10 p-6">
                <Bot className="h-10 w-10 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-medium">Ask Your Agents</h3>
              <p className="mb-8 max-w-md">
                Type a question below or choose a suggestion to get started. Our agents will research and provide comprehensive answers.
              </p>
              <div className="grid gap-2 md:grid-cols-2">
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 text-left"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <Sparkles className="h-4 w-4" />
                      {suggestion}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="mb-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-lg bg-accent p-4"
              >
                <p className="font-medium">{currentQuestion.text}</p>
              </motion.div>
              
              {currentQuestion.responses.map((response, index) => (
                <ChatBubble 
                  key={response.agentId + "-" + index}
                  response={response} 
                  index={index} 
                />
              ))}
              
              {getExpectedAgentCount() > 0 && (
                <>
                  {Array.from({ length: getExpectedAgentCount() }).map((_, index) => (
                    <motion.div
                      key={`skeleton-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="mb-6"
                    >
                      <div className="mb-1 flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <div className="ml-10 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/6" />
                      </div>
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center py-4"
                  >
                    <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Agents are researching...
                    </div>
                  </motion.div>
                </>
              )}
            </div>
          )}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>
      
      <div className="border-t bg-card p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask something..."
            disabled={loading}
            className="flex-1"
          />
          <Tooltip content="Send question">
            <Button type="submit" disabled={loading || !question.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </Tooltip>
        </form>
      </div>
    </div>
  );
}