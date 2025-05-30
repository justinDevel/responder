"use client";

import { Agent } from "@/types/agent";
import { AgentCard } from "./AgentCard";
import { useEffect, useState } from "react";
import {  getAgents, updateAgent } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus } from "lucide-react";
import { motion } from "framer-motion";

export function AgentGrid() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const { toast } = useToast();
  const noAgentsmessage = 'Sorry we don\'t have any agents to show you yet.';

  useEffect(() => {
    const loadAgents = async () => {
      try {
        const data = await getAgents();
        setAgents(data);
      } catch (error) {
        toast({
          title: "Error loading agents",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadAgents();
  }, [toast]);





  const handleToggleActive = async (agentId: string, active: boolean) => {
    try {
      const agentToUpdate = agents.find((agent) => agent.id === agentId);
      if (!agentToUpdate) return;

      const updatedAgent = await updateAgent({ ...agentToUpdate, active });
      
      setAgents(
        agents.map((agent) => (agent.id === agentId ? updatedAgent : agent))
      );
      
      toast({
        title: active ? "Agent activated" : "Agent deactivated",
        description: `The agent is now ${active ? "active" : "inactive"}.`,
      });
    } catch (error) {
      toast({
        title: "Error updating agent",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };



  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Agents</h2>
       
      </div>

      {agents.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center"
        >
          <h3 className="mb-2 text-xl font-medium">No agents yet</h3>
          <p className="mb-4 text-muted-foreground">
            {noAgentsmessage}
          </p>
        
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onToggleActive={handleToggleActive}
            />
          ))}
        </div>
      )}

   
    </div>
  );
}