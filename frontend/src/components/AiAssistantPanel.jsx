import React, { useState, useRef } from "react";
import {
  UploadCloud,
  Mail,
  CheckCircle2,
  Bot,
  Send,
  FileText,
  X,
  Sparkles,
} from "lucide-react";

const API_BASE = "http://localhost:8000";

export default function AiAssistantPanel({ onExtract, onSummaryGenerated }) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isExtracting, setIsExtracting] = useState(false);
  const [summary, setSummary] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);

  const [chatLog, setChatLog] = useState([
    {
      sender: "ai",
      message:
        "Upload a complaint document or paste text above. I will automatically extract the details and populate the complaint form.",
    },
  ]);

  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };
  const processFile = async (selectedFile) => {
    try {
      setFile(selectedFile);
      setProgress(10);
      setIsExtracting(true);

      const formData = new FormData();
      formData.append("file", selectedFile);

      setProgress(30);

      const response = await fetch(`${API_BASE}/api/extract-complaint`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded ${response.status}`);
      }

      setProgress(70);

      const result = await response.json();

      setProgress(100);
      setIsExtracting(false);

      if (!result.success) {
        throw new Error(result.message || "Extraction failed.");
      }

      const complaintData = {
        complaintSource: "Customer Email",
        customerName: result.data.customerName || "",
        productName: result.data.productName || "",
        productStrength: result.data.productStrength || "",
        batchNumber: result.data.batchNumber || "",
        manufacturingDate: result.data.manufacturingDate || "",
        expiryDate: result.data.expiryDate || "",
        quantityAffected: String(result.data.quantityAffected || ""),
        quantityUnit: result.data.quantityUnit || "Boxes",
        complaintType: result.data.complaintType || "",
        complaintDate: new Date().toISOString().split("T")[0],
        description: result.data.description || "",
        severity: result.data.severity || "Medium",
        priority: result.data.priority || "Medium",
      };

      if (onExtract) {
        onExtract(complaintData);
      }

      await generateSummary(complaintData);

      setChatLog((prev) => [
        ...prev,
        {
          sender: "ai",
          message:
            "Complaint extracted successfully. The complaint form has been automatically populated. Please review the values before saving.",
        },
      ]);
    } catch (error) {
      console.error(error);

      setProgress(0);
      setIsExtracting(false);

      setChatLog((prev) => [
        ...prev,
        {
          sender: "ai",
          message: `Unable to extract complaint information (${error.message}). Is the backend running at ${API_BASE}?`,
        },
      ]);
    }
  };

  const generateSummary = async (complaintData) => {
    try {
      console.log("Sending payload:", complaintData);

      const response = await fetch(`${API_BASE}/api/generate-summary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(complaintData),
      });

      console.log("Status:", response.status);

      if (!response.ok) {
        const error = await response.text();
        console.error("Backend Error:", error);
        return;
      }

      const result = await response.json();

      console.log("Summary Response:", result);

      if (result.success) {
        setSummary(result.summary);
        if (onSummaryGenerated) {
          onSummaryGenerated(result.summary);
        }

        setChatLog((prev) => [
          ...prev,
          {
            sender: "ai",
            message: "AI summary generated successfully.",
          },
        ]);
      }
    } catch (err) {
      console.error("Generate Summary Error:", err);
    }
  };
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput;

    // Show user message
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

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const result = await response.json();

      setChatLog((prev) => [
        ...prev,
        {
          sender: "ai",
          message: result.answer,
        },
      ]);
    } catch (err) {
      console.error(err);

      setChatLog((prev) => [
        ...prev,
        {
          sender: "ai",
          message: "Unable to connect to the AI assistant.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };
  const handleClearFile = () => {
    setFile(null);
    setProgress(0);
    setIsExtracting(false);
    setSummary("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-5 shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          <h2 className="text-[17px] font-bold text-slate-900">
            AI Complaint Intake Assistant
          </h2>
        </div>

        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px] font-bold rounded uppercase tracking-wider">
          Beta
        </span>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pb-4 min-h-0">
        {!file ? (
          <>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-indigo-500 bg-indigo-100"
                  : "border-indigo-200 bg-indigo-50/30 hover:bg-indigo-50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.eml"
                onChange={handleFileSelect}
              />

              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 text-indigo-600">
                <UploadCloud className="w-5 h-5" />
              </div>

              <p className="text-sm font-semibold text-slate-700 mb-1">
                {isDragging
                  ? "Drop complaint file here"
                  : "Drag & Drop Complaint Document"}
              </p>

              <p className="text-sm text-indigo-600 font-medium">
                or Click to Browse
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <div className="flex-1 h-px bg-slate-200"></div>

              <span className="text-xs text-slate-400 font-semibold uppercase">
                OR
              </span>

              <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50">
              <Mail className="w-4 h-4" />
              Paste Complaint Text / Email
            </button>

            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />

              <div>
                <p className="text-sm font-semibold text-emerald-700">
                  Supported Formats
                </p>

                <p className="text-xs text-emerald-600">
                  PDF • DOC • DOCX • TXT • EML (Max 10MB)
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>

                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-slate-700 truncate">
                    {file.name}
                  </p>

                  <p className="text-xs text-slate-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>

              {!isExtracting && (
                <button
                  onClick={handleClearFile}
                  className="text-slate-400 hover:text-red-500"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] uppercase font-bold text-slate-500">
                  {isExtracting
                    ? "Extracting Complaint..."
                    : "Extraction Completed"}
                </span>

                <span className="text-xs font-bold text-indigo-600">
                  {progress}%
                </span>
              </div>

              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 transition-all duration-300"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              {isExtracting && (
                <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                  AI is reading the uploaded complaint document, extracting
                  customer information, product details, complaint description
                  and automatically filling the complaint form...
                </p>
              )}

              {!isExtracting && progress === 100 && (
                <p className="text-xs text-green-600 mt-3 font-medium">
                  ✓ Complaint extracted successfully. Please review the
                  auto-filled form before saving.
                </p>
              )}
            </div>
          </div>
        )}

        {/* AI Chat */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-3">
            AI Assistant
          </span>

          <div className="space-y-4">
            {chatLog.map((chat, index) => (
              <div
                key={index}
                className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 flex gap-3"
              >
                <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>

                <div className="flex-1">
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {chat.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {summary && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
          <h3 className="font-semibold text-indigo-700 mb-2">
            AI Complaint Summary
          </h3>

          <p className="text-sm text-slate-700 whitespace-pre-wrap">
            {summary}
          </p>
        </div>
      )}
      {/* Footer */}
      <div className="pt-4 border-t border-slate-100 shrink-0 bg-white">
        <div className="relative">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            placeholder="Ask me anything about this complaint..."
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            onClick={handleSendMessage}
            disabled={chatLoading}
            className="absolute right-1.5 top-1.5 bottom-1.5 w-9 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <p className="text-center text-[10px] text-slate-400 mt-3">
          AI responses may contain errors. Please verify extracted information
          before saving.
        </p>
      </div>
    </div>
  );
}
