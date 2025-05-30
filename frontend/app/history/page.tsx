"use client";

import { Conversation } from "@/types/agent";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { getConversationHistory } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function HistoryPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await getConversationHistory();
        setConversations(history);
      } catch (error) {
        console.error("Error loading history:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">Conversation History</h1>
        <p className="text-lg text-muted-foreground">
          Review your past research conversations
        </p>
      </div>

      {conversations.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h3 className="mb-2 text-xl font-medium">No conversations yet</h3>
          <p className="mb-4 text-muted-foreground">
            Ask your agents questions to start building your history
          </p>
          <Link
            href="/ask"
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Ask a Question
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {conversations.map((conversation) => {
            const date = new Date(conversation.timestamp);
            const timeAgo = formatDistanceToNow(date, { addSuffix: true });
            
            return (
              <Link href={`/ask?conversation=${conversation.id}`} key={conversation.id}>
                <Card className="h-full cursor-pointer transition-all hover:shadow-md">
                  <CardHeader>
                    <CardTitle>{conversation.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      {conversation.questions.length} question{conversation.questions.length !== 1 ? 's' : ''}
                    </div>
                    <div className="mt-4 line-clamp-2 text-sm">
                      {conversation.questions[0]?.text}
                    </div>
                    <div className="mt-4 text-xs text-muted-foreground">
                      {timeAgo}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}