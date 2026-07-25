import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import LogComplaintForm from "./components/LogComplaintForm";
import AiAssistantPanel from "./components/AiAssistantPanel";
import ComplaintList from "./components/ComplaintList";
import AiChatModal from "./components/AiChatModal";

export default function App() {
  const [showComplaints, setShowComplaints] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);
  const [summary, setSummary] = useState("");

  // Stores AI extracted complaint data
  const [extractedData, setExtractedData] = useState(null);

  const [resetForm, setResetForm] = useState(0);

  return (
    <div className="flex h-screen w-full font-sans overflow-hidden">
      <Sidebar onOpenAiChat={() => setShowAiChat(true)} />

      <main className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden bg-[#f4f7fb]">
        {/* Topbar */}
        <Topbar
          showComplaints={showComplaints}
          onToggleComplaints={() => setShowComplaints(!showComplaints)}
        />

        {/* Workspace */}
        <div className="flex-1 overflow-hidden p-3">
          {showComplaints ? (
            <ComplaintList
              onDeleteSuccess={() => {
                setExtractedData(null);
                setResetForm((prev) => prev + 1);
              }}
            />
          ) : (
            <div className="flex flex-row gap-3 h-full max-w-[1600px] mx-auto items-stretch">
              {/* Complaint Form */}
              <div className="w-[58%] h-full overflow-hidden rounded-xl">
                <LogComplaintForm
                  extractedData={extractedData}
                  resetForm={resetForm}
                />
              </div>

              {/* AI Assistant */}
              <div className="w-[42%] h-full overflow-hidden rounded-xl">
                <AiAssistantPanel
                  onExtract={setExtractedData}
                  onSummaryGenerated={setSummary}
                />
              </div>
            </div>
          )}
        </div>
      </main>
      <AiChatModal
        show={showAiChat}
        onClose={() => setShowAiChat(false)}
        summary={summary}
      />
    </div>
  );
}
