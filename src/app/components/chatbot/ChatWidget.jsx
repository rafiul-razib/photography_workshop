"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatWindow from "./ChatWindow";

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="animate-in slide-in-from-bottom-4 fade-in duration-300">
          <ChatWindow onClose={() => setIsOpen(false)} />
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 border rounded-full bg-purple-600 from-chat-primary to-chat-secondary shadow-chat hover:shadow-chat-hover transition-all duration-300 hover:scale-105"
          size="icon"
        >
          <MessageCircle className="h-full w-full text-primary-foreground" />
        </Button>
      )}
    </div>
  );
}

export default ChatWidget;
