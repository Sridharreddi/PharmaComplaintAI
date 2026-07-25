import { useRef } from "react";
import {
  UploadCloud,
  FileText,
  Sparkles,
  Send,
  CheckCircle2,
} from "lucide-react";
import ChatBox from "./ChatBox";

export default function AISection({
  selectedFile,
  extractionPercent = 0,
  messages = [],
  chatInput,
  setChatInput,
  onFileSelect,
  onSend,
}) {
  const fileRef = useRef(null);

  return (
    <div className="bg-white rounded-xl border border-[#E8ECF4] shadow-sm p-4 h-full flex flex-col">
      {/* Header */}

      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-[#5B4CF6]" />

            <h2 className="text-lg font-semibold text-[#111827]">
              AI Assistant
            </h2>
          </div>

          <p className="text-sm text-[#6B7280] mt-1">
            Extract complaint details and chat with AI
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-[#EEF2FF] text-[#5B4CF6] text-xs font-semibold">
          BETA
        </span>
      </div>

      {/* Upload */}

      <div
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-[#D9DDE8] rounded-xl bg-[#FAFBFF] p-4 text-center cursor-pointer hover:border-[#5B4CF6] transition"
      >
        <UploadCloud size={34} className="mx-auto text-[#5B4CF6]" />

        <h3 className="mt-4 text-sm font-semibold text-[#111827]">
          Upload Complaint
        </h3>

        <p className="mt-2 text-xs text-[#6B7280]">PDF, DOCX or TXT</p>

        <button
          type="button"
          className="mt-5 h-10 px-5 rounded-xl bg-[#5B4CF6] text-white text-sm font-medium"
        >
          Choose File
        </button>

        <input ref={fileRef} type="file" hidden onChange={onFileSelect} />
      </div>

      {/* File */}

      {selectedFile && (
        <div className="mt-5 rounded-xl border border-[#E5E7EB] p-4 flex items-center gap-3">
          <FileText className="text-[#5B4CF6]" size={22} />

          <div className="flex-1">
            <p className="text-sm font-medium text-[#111827]">
              {selectedFile.name}
            </p>

            <p className="text-xs text-[#6B7280]">Ready for extraction</p>
          </div>

          <CheckCircle2 size={18} className="text-green-500" />
        </div>
      )}

      {/* Progress */}

      {extractionPercent > 0 && (
        <div className="mt-6">
          <div className="flex justify-between text-xs mb-2">
            <span>AI Extraction</span>

            <span>{extractionPercent}%</span>
          </div>

          <div className="w-full h-2 rounded-full bg-[#EEF2F7] overflow-hidden">
            <div
              className="h-full bg-[#5B4CF6] rounded-full"
              style={{
                width: `${extractionPercent}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Chat */}

      <div className="flex-1 mt-6 overflow-y-auto">
        <ChatBox messages={messages} />
      </div>

      {/* Input */}

      <div className="mt-5 flex gap-3">
        <input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Ask AI..."
          className="flex-1 h-11 rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:border-[#5B4CF6] focus:ring-4 focus:ring-[#EEF2FF]"
        />

        <button
          onClick={onSend}
          className="h-11 w-11 rounded-xl bg-[#5B4CF6] text-white flex items-center justify-center"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
