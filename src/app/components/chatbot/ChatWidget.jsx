"use client";

import { useState } from "react";
import { Aperture } from "lucide-react";
import { FaCameraRetro } from "react-icons/fa";
import ChatWindow from "./ChatWindow";

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50 sm:bottom-6 sm:right-6">
      {isOpen ? (
        <div className="animate-in slide-in-from-bottom-4 fade-in duration-300">
          <ChatWindow onClose={() => setIsOpen(false)} />
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative grid h-16 w-16 place-items-center overflow-hidden rounded-full border border-[#F07A10]/45 bg-[#0B1628] text-[#F07A10] shadow-[0_18px_50px_rgba(0,0,0,0.45)] transition duration-300 hover:scale-105 hover:border-[#F07A10]"
          aria-label="Open workshop assistant"
        >
          <span className="absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,rgba(240,122,16,0.35),transparent_42%),linear-gradient(135deg,rgba(240,122,16,0.18),rgba(7,16,32,0.1))]" />
          <span className="relative grid h-11 w-11 place-items-center rounded-full border border-[#F07A10]/35 bg-[#071020]/65">
            <Aperture className="absolute h-8 w-8 opacity-30 transition duration-300 group-hover:rotate-45" />
            <FaCameraRetro className="h-5 w-5 text-white transition group-hover:-translate-y-0.5" />
          </span>
        </button>
      )}
    </div>
  );
}

export default ChatWidget;
