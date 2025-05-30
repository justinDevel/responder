"use client";

import { AgentResponse } from "@/types/agent";
import { motion } from "framer-motion";
import { ExternalLink, ThumbsUp, ThumbsDown, Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";

interface ChatBubbleProps {
  response: AgentResponse;
  index: number;
}

export function ChatBubble({ response, index }: ChatBubbleProps) {
  const [isLiked, setIsLiked] = useState<boolean | null>(null);
  const { toast } = useToast();



  const handleCopy = async () => {
    await navigator.clipboard.writeText(response.content);
    toast({
      title: "Copied to clipboard",
      description: "The response has been copied to your clipboard.",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Shared from Responder",
          text: response.content,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      await handleCopy();
    }
  };

  const handleFeedback = (liked: boolean) => {
    setIsLiked(liked);
    toast({
      title: "Feedback received",
      description: "Thank you for your feedback!",
    });
  };
  console.log("Response from chatBubble:", response);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="mb-6"
    >
      <div className="mb-1 flex items-center gap-2">
        <div 
          className="flex h-8 w-8 items-center justify-center rounded-full text-sm"
          style={{ backgroundColor: response.agentColor || `#${Math.floor(Math.random()*16777215).toString(16)}` }}
        >
          {response.name.charAt(0)}
        </div>
        <span className="font-medium">{response.name}</span>
      </div>
      
      <div className="ml-10 rounded-lg bg-card p-4">
        <div className="mb-4 text-sm"><MarkdownRenderer markdown={response.content} />
</div>
        
        {response.citations.length > 0 && (
          <div className="mt-2 border-t pt-2 flex flex-row">
            <p className="px-1 py-1 text-xs font-medium text-muted-foreground">Sources:</p>
            <ul className="flex flex-row flex-wrap gap-2">
              {response.citations.map((citation, i) => (
                <li key={i} className="flex items-center text-xs transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-2 py-1">
                  <ExternalLink className="mr-1 h-3 w-3 text-muted-foreground" />
                  <a
                    href={citation}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-blue-500  hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                  >
                    {citation}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t pt-2">
          <div className="flex gap-1">
            <Tooltip content="Helpful">
              <Button
                variant="ghost"
                size="sm"
                className={isLiked === true ? "text-green-500" : ""}
                onClick={() => handleFeedback(true)}
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Not helpful">
              <Button
                variant="ghost"
                size="sm"
                className={isLiked === false ? "text-red-500" : ""}
                onClick={() => handleFeedback(false)}
              >
                <ThumbsDown className="h-4 w-4" />
              </Button>
            </Tooltip>
          </div>
          
          <div className="flex gap-1">
            <Tooltip content="Copy response">
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Share response">
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
    </motion.div>
  );
}