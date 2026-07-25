import { Bot, User } from "lucide-react";

export default function ChatBox({ messages = [] }) {
  return (
    <div className="space-y-4">
      {messages.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#D6DBE6] bg-[#FAFBFF] p-3 text-center">
          <Bot className="mx-auto mb-3 text-[#5B4CF6]" size={28} />

          <h3 className="text-sm font-semibold text-[#111827]">
            AI Assistant Ready
          </h3>

          <p className="mt-2 text-xs leading-6 text-[#6B7280]">
            Upload a complaint document or ask a question to begin AI analysis.
          </p>
        </div>
      ) : (
        messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex max-w-[85%] gap-3 ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  msg.sender === "user"
                    ? "bg-[#4F46E5] text-white"
                    : "bg-[#EEF2FF] text-[#4F46E5]"
                }`}
              >
                {msg.sender === "user" ? <User size={16} /> : <Bot size={16} />}
              </div>

              <div
                className={`rounded-xl px-4 py-3 text-sm leading-6 ${
                  msg.sender === "user"
                    ? "bg-[#4F46E5] text-white"
                    : "bg-[#F8FAFC] border border-[#E5E7EB] text-[#111827]"
                }`}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
