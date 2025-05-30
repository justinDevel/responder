import { AgentGrid } from "@/components/agents/AgentGrid";

export default function Home() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">Responder</h1>
        <p className="text-lg text-muted-foreground">
          Create and manage your research agents
        </p>
      </div>
      
      <AgentGrid />
    </div>
  );
}