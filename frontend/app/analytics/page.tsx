"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Loader2, BarChart3, Users, Clock, Brain } from "lucide-react";
import { getConversationHistory } from "@/lib/api";
import { Conversation } from "@/types/agent";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AnalyticsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const history = await getConversationHistory();
        setConversations(history);
      } catch (error) {
        console.error("Error loading analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getAgentPerformanceData = () => {
    const agentStats = new Map();
    
    conversations.forEach(conv => {
      conv.questions.forEach(q => {
        q.responses.forEach(r => {
          if (!agentStats.has(r.agentName)) {
            agentStats.set(r.agentName, {
              name: r.agentName,
              responses: 0,
              avgTime: 0,
              citations: 0
            });
          }
          
          const stats = agentStats.get(r.agentName);
          stats.responses++;
          stats.citations += r.citations.length;
        });
      });
    });

    return Array.from(agentStats.values());
  };

  const getQuestionsOverTime = () => {
    const timeData = conversations.map(conv => ({
      date: new Date(conv.timestamp).toLocaleDateString(),
      questions: conv.questions.length,
      responses: conv.questions.reduce((acc, q) => acc + q.responses.length, 0)
    }));

    return timeData;
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Analytics Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Start a conversation to see your analytics
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0s</div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex justify-center">
          <Link href="/ask">
            <Button size="lg">
              Start Your First Conversation
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">Analytics Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          Insights from your research conversations
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Agent Performance</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getAgentPerformanceData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="responses" fill="hsl(var(--chart-1))" name="Responses" />
                <Bar dataKey="citations" fill="hsl(var(--chart-2))" name="Citations" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Research Activity</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getQuestionsOverTime()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="questions" 
                  stroke="hsl(var(--chart-3))" 
                  name="Questions" 
                />
                <Line 
                  type="monotone" 
                  dataKey="responses" 
                  stroke="hsl(var(--chart-4))" 
                  name="Responses" 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}