"use client";

import { Agent } from "@/types/agent";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Trash, Edit, ToggleLeft as Toggle, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { motion, useDragControls } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";

interface AgentCardProps {
  agent: Agent;
  onToggleActive: (agentId: string, active: boolean) => void;
}

export function AgentCard({ 
  agent, 
  onToggleActive 
}: AgentCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const dragControls = useDragControls();

  const hexToRgba = (hex: string, alpha: number = 0.15) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="touch-none"
      style={{ height: "100%" }}
      drag
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0.2}
      dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
    >
      <Card 
        className="h-full overflow-hidden transition-all duration-300 cursor-grab active:cursor-grabbing"
        style={{
          background: `linear-gradient(135deg, ${hexToRgba(agent.color, 0.1)}, transparent)`,
          borderLeft: `4px solid ${agent.color}`,
        }}
        onPointerDown={(e) => {
          e.preventDefault();
          dragControls.start(e);
        }}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <Tooltip content={`${agent.name}'s avatar`}>
              <div 
                className="flex h-10 w-10 items-center justify-center rounded-full text-lg"
                style={{ backgroundColor: agent.color }}
              >
                {agent.avatar}
              </div>
            </Tooltip>
            <div>
              <h3 className="font-medium">{agent.name}</h3>
              <Badge 
                variant={agent.active ? "default" : "outline"} 
                className={cn(
                  "text-xs",
                  agent.active 
                    ? "bg-green-500 hover:bg-green-500" 
                    : "text-muted-foreground"
                )}
              >
                {agent.active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
            
              <DropdownMenuItem onClick={() => onToggleActive(agent.id, !agent.active)}>
                <Toggle className="mr-2 h-4 w-4" />
                {agent.active ? "Deactivate" : "Activate"}
              </DropdownMenuItem>
             
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        
        <CardContent>
          <p className="text-sm text-muted-foreground">{agent.role}</p>
        </CardContent>
        
        <CardFooter className="text-xs text-muted-foreground">
          Last updated: {agent.lastUpdated}
        </CardFooter>
      </Card>
    </motion.div>
  );
}