"use client";
import { useState } from "react";

export default function ReunionChatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      { role: "bot", text: data.reply },
    ]);

    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white shadow-xl rounded-xl p-4">
      <h3 className="font-bold mb-2">Reunion Assistant 🤖</h3>

      <div className="h-60 overflow-y-auto space-y-2 mb-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded ${
              msg.role === "user"
                ? "bg-blue-100 text-right"
                : "bg-gray-100"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && <p className="text-sm text-gray-400">Typing...</p>}
      </div>

      <div className="flex gap-2">
        <input
          className="border rounded px-2 py-1 w-full"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the reunion..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-3 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
