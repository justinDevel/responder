"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [isAutoSave, setIsAutoSave] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    
    const savedApiKey = localStorage.getItem("perplexityApiKey");
    const savedAutoSave = localStorage.getItem("autoSave");
    const savedTheme = localStorage.getItem("theme");

    if (savedApiKey) setApiKey(savedApiKey);
    if (savedAutoSave) setIsAutoSave(savedAutoSave === "true");
    if (savedTheme) setIsDarkTheme(savedTheme === "dark");
  }, []);

  const handleSaveSettings = () => {
    
    localStorage.setItem("perplexityApiKey", apiKey);
    localStorage.setItem("autoSave", isAutoSave.toString());
    localStorage.setItem("theme", isDarkTheme ? "dark" : "light");

    toast({
      title: "Settings saved",
      description: "Your preferences have been updated",
    });
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">Settings</h1>
        <p className="text-lg text-muted-foreground">
          Manage your application preferences
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription>
              Configure your Perplexity Sonar API settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Perplexity API key"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveSettings}>Save API Settings</Button>
          </CardFooter>
        </Card> */}

        <Card>
          <CardHeader>
            <CardTitle>Application Preferences</CardTitle>
            <CardDescription>
              Customize your experience with Responder
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-y-0">
              <Label htmlFor="auto-save">Auto-save conversations</Label>
              <Switch
                id="auto-save"
                checked={isAutoSave}
                onCheckedChange={setIsAutoSave}
              />
            </div>
            <div className="flex items-center justify-between space-y-0">
              <Label htmlFor="dark-theme">Default to dark theme</Label>
              <Switch
                id="dark-theme"
                checked={isDarkTheme}
                onCheckedChange={setIsDarkTheme}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveSettings}>Save Preferences</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}