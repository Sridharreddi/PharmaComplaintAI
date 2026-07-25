import React, { useState } from "react";
import { X, Send, Bot } from "lucide-react";

const API_BASE = "http://localhost:8000";

export default function AiChatModal({ show, onClose, summary }) {
  const [chatInput, setChatInput] = useState("");

  const [chatLoading, setChatLoading] = useState(false);

  const [chatLog, setChatLog] = useState([
    {
      sender: "ai",
      message: "Hello! Ask me anything about the uploaded complaint.",
    },
  ]);

  if (!show) return null;

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput;

    setChatLog((prev) => [
      ...prev,
      {
        sender: "user",
        message: userMessage,
      },
    ]);

    setChatInput("");
    setChatLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userMessage,
          complaint: summary,
        }),
      });

      const result = await response.json();

      setChatLog((prev) => [
        ...prev,
        {
          sender: "ai",
          message: result.answer,
        },
      ]);
    } catch {
      setChatLog((prev) => [
        ...prev,
        {
          sender: "ai",
          message: "Unable to connect to AI.",
        },
      ]);
    }

    setChatLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-[700px] h-[700px] bg-white rounded-2xl shadow-2xl flex flex-col">
        <div className="flex justify-between items-center border-b p-5">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-600" />
            AI Assistant
          </h2>

          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50">
          {chatLog.map((chat, index) => (
            <div
              key={index}
              className={`flex ${
                chat.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-3 rounded-xl max-w-[80%] ${
                  chat.sender === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100"
                }`}
              >
                {chat.message}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t p-4 flex gap-3">
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            placeholder="Ask anything..."
            className="flex-1 h-12 rounded-xl border border-slate-300 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            onClick={handleSendMessage}
            disabled={chatLoading}
            className="h-12 w-12 flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
