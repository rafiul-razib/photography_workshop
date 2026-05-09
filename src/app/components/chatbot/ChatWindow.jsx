"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { useToast } from "@/hooks/use-toast";

// Env vars
const CHAT_URL = `https://reunion-cpscm-server.vercel.app/chat`;
// const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function ChatWindow({ onClose }) {
//   const { toast } = useToast();

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm here to help you with questions about the reunion event. Ask me about event details, registration, or payment!",
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // IMPORTANT: ref goes to ScrollArea VIEWPORT
  const viewportRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    let assistantContent = "";

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        //   Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({
          // messages: [...messages, userMessage],
          messages: [userMessage],
        }),
      });

      // console.log("AI response", response)

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();
      console.log(data);
      const assistantMessage = { role: "assistant", content: data.reply };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      alert({
        title: "Chat error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="w-80 sm:w-96 h-[500px] bg-chat-background border border-chat-border rounded-2xl shadow-chat-window flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-linear-to-r from-purple-900 to-purple-950 p-4 flex items-center justify-between">
        <h3 className="font-semibold text-primary-foreground">
          Event Assistant
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 bg-black overflow-y-scroll">
        <div ref={viewportRef} className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm text-white whitespace-pre-wrap bg-gradient-to-br from-blue-900 to-blue-950 ${
                  message.role === "user"
                    ? "bg-gradient-to-br from-blue-900 to-blue-950 text-primary-foreground"
                    : "bg-chat-message text-chat-message-foreground"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-chat-border bg-gray-700">
        <div className="flex gap-2 text-white">
          <Input
            value={input}
            className="bg-white text-black"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
