import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Send, Minimize2, ThumbsUp, ThumbsDown } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  queryId?: number;
}

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content: user 
        ? "Hi! I'm here to help you with email delivery questions. What can I assist you with today?"
        : "Hi! Please sign up or log in to access the AI assistant and get help with email delivery questions.",
    },
  ]);

  const queryMutation = useMutation({
    mutationFn: async (query: string) => {
      const res = await apiRequest("POST", "/api/ai/query", { query });
      return await res.json();
    },
    onSuccess: (data) => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "assistant",
          content: data.response,
          queryId: data.queryId,
        },
      ]);
    },
    onError: (error) => {
      toast({
        title: "AI Assistant Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    },
  });

  const rateMutation = useMutation({
    mutationFn: async ({ queryId, rating }: { queryId: number; rating: number }) => {
      const res = await apiRequest("POST", `/api/ai/rate/${queryId}`, { rating });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);

    if (!user) {
      // Show authentication message for unauthenticated users
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "Please log in to use the AI assistant. You can sign up for free to access this feature and get help with email delivery questions!",
      }]);
      setInput("");
      return;
    }

    queryMutation.mutate(input);
    setInput("");
  };

  const handleRate = (queryId: number, rating: number) => {
    rateMutation.mutate({ queryId, rating });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <Card className="w-80 h-96 mb-4 shadow-2xl">
          <CardHeader className="bg-primary text-white rounded-t-lg">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">AI Assistant</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white hover:bg-opacity-20"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex flex-col h-80">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div key={message.id}>
                  <div
                    className={`
                      p-3 rounded-lg max-w-[80%] 
                      ${message.type === "user" 
                        ? "bg-primary text-white ml-auto" 
                        : "bg-gray-100 text-gray-800"
                      }
                    `}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  {message.type === "assistant" && message.queryId && (
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs text-gray-500">Was this helpful?</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRate(message.queryId!, 5)}
                        className="h-6 w-6 p-0"
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRate(message.queryId!, 1)}
                        className="h-6 w-6 p-0"
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              {queryMutation.isPending && (
                <div className="bg-gray-100 p-3 rounded-lg max-w-[80%]">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
                    <span className="text-sm text-gray-600">Thinking...</span>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t">
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1"
                  disabled={queryMutation.isPending}
                />
                <Button type="submit" size="sm" disabled={queryMutation.isPending}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary-700"
      >
        <Bot className="w-6 h-6" />
      </Button>
    </div>
  );
}
