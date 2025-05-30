"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download, FileText, Image, FileJson } from "lucide-react";
import { getConversationHistory } from "@/lib/api";
import { Conversation } from "@/types/agent";
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";
import { markdownToPlainText } from "@/components/ui/markdownToPlainText";
import { markdownToReadableText } from "@/lib/utils";

export default function ExportPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { toast } = useToast();

  useState(() => {
    const loadConversations = async () => {
      const history = await getConversationHistory();
      setConversations(history);
    };
    loadConversations();
  }, []);

  const exportAsPDF = async (conversation: Conversation) => {
  const pdf = new jsPDF();
  const pageHeight = pdf.internal.pageSize.height;
  let yOffset = 20;


  pdf.setFontSize(20);
  pdf.text(conversation.title, 20, yOffset);
  yOffset += 20;

  for (const question of conversation.questions) {
    pdf.setFontSize(14);
    yOffset = checkPageBreak(pdf, yOffset, 10);
    pdf.text(`Q: ${question.text}`, 20, yOffset);
    yOffset += 10;

    for (const response of question.responses) {
      pdf.setFontSize(12);
      yOffset = checkPageBreak(pdf, yOffset, 10);
      pdf.text(`${response.name}:`, 20, yOffset);
      yOffset += 10;

      const plainText = markdownToPlainText(response.content);
      const lines = pdf.splitTextToSize(plainText, 170);

      for (const line of lines) {
        yOffset = checkPageBreak(pdf, yOffset, 7);
        pdf.text(line, 20, yOffset);
        yOffset += 7;
      }

      if (response.citations.length > 0) {
        pdf.setFontSize(10);
        for (const citation of response.citations) {
          yOffset = checkPageBreak(pdf, yOffset, 7);
          pdf.text(`- ${citation}`, 30, yOffset);
          yOffset += 7;
        }
      }

      yOffset += 10;
    }
}
    
    pdf.save(`${conversation.title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
    
    toast({
      title: "PDF exported",
      description: "Your conversation has been exported as PDF",
    });
  };

  function checkPageBreak(pdf: jsPDF, yOffset: number, lineHeight: number): number {
  const pageHeight = pdf.internal.pageSize.height;
  if (yOffset + lineHeight > pageHeight - 10) {
    pdf.addPage();
    return 20;
  }
  return yOffset;
}

  const exportAsImage = async (conversation: Conversation) => {
    const element = document.getElementById(`conversation-${conversation.id}`);
    if (!element) return;
    
    try {
      const dataUrl = await toPng(element);
      saveAs(dataUrl, `${conversation.title.toLowerCase().replace(/\s+/g, '-')}.png`);
      
      toast({
        title: "Image exported",
        description: "Your conversation has been exported as image",
      });
    } catch (error) {
      console.error('Error exporting image:', error);
      toast({
        title: "Export failed",
        description: "Failed to export conversation as image",
        variant: "destructive",
      });
    }
  };

  const exportAsJSON = (conversation: Conversation) => {
    const dataStr = JSON.stringify(conversation, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    saveAs(dataBlob, `${conversation.title.toLowerCase().replace(/\s+/g, '-')}.json`);
    
    toast({
      title: "JSON exported",
      description: "Your conversation has been exported as JSON",
    });
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">Export Conversations</h1>
        <p className="text-lg text-muted-foreground">
          Export your research conversations in different formats
        </p>
      </div>

      <div className="grid gap-6">
        {conversations.map((conversation) => (
          <Card key={conversation.id}>
            <CardHeader>
              <CardTitle>{conversation.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                id={`conversation-${conversation.id}`} 
                className="mb-4 rounded-lg border p-4"
              >
                {conversation.questions.map((question, index) => (
                  <div key={index} className="mb-4">
                    <p className="font-medium">Q: {question.text}</p>
                    {question.responses.map((response, rIndex) => (
                      <div key={rIndex} className="ml-4 mt-2">
                        <p className="font-medium">{response.name}:</p>
                        <p className="mt-1 text-sm"><MarkdownRenderer markdown={response.content} /></p>
                        {response.citations.length > 0 && (
                          <div className="mt-2 text-xs text-muted-foreground ">
                            Sources:
                            {response.citations.map((citation, cIndex) => (
                              <div key={cIndex}>{citation}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => exportAsPDF(conversation)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Export as PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => exportAsImage(conversation)}
                >
                  <Image className="mr-2 h-4 w-4" />
                  Export as Image
                </Button>
                <Button
                  variant="outline"
                  onClick={() => exportAsJSON(conversation)}
                >
                  <FileJson className="mr-2 h-4 w-4" />
                  Export as JSON
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}