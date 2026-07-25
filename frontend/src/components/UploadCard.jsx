import { UploadCloud, Mail, CheckCircle2 } from "lucide-react";

function UploadCard({ onFileSelect, onPasteClick }) {
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelect?.(file);
  };

  return (
    <div>
      <label
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-indigo-300
                   bg-indigo-50/40 rounded-xl py-8 px-4 cursor-pointer hover:bg-indigo-50 transition-colors"
      >
        <UploadCloud className="w-7 h-7 text-indigo-500" />
        <p className="text-sm text-gray-600 text-center">
          <span className="font-medium text-gray-700">
            Drag & drop complaint document here
          </span>
          <br />
          or click to browse
        </p>
        <input
          type="file"
          className="hidden"
          onChange={(e) =>
            e.target.files?.[0] && onFileSelect?.(e.target.files[0])
          }
        />
      </label>

      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 font-medium">OR</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <button
        onClick={onPasteClick}
        className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2.5
                   text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
      >
        <Mail className="w-4 h-4" />
        Paste Complaint Text / Email
      </button>

      <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-3 py-2 mt-4 text-xs">
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        Supported formats: PDF, DOCX, TXT, EML — Max file size: 10MB
      </div>
    </div>
  );
}

export default UploadCard;
