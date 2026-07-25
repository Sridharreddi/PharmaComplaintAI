import { useState } from "react";
import {
  User,
  Package,
  AlertTriangle,
  ShieldAlert,
  RotateCcw,
  Save,
  Bot,
  Send,
  UploadCloud,
  Mail,
  CheckCircle2,
  Sparkles,
  Loader2,
} from "lucide-react";
import FormInput from "../components/FormInput";
import FormSelect from "../components/FormSelect";
import QuantityInput from "../components/QuantityInput";

const API_BASE = "http://localhost:8000";

const sectionThemes = {
  blue: { bg: "bg-blue-100", text: "text-blue-600" },
  green: { bg: "bg-green-100", text: "text-green-600" },
  orange: { bg: "bg-orange-100", text: "text-orange-600" },
  pink: { bg: "bg-pink-100", text: "text-pink-600" },
};

function SectionHeader({ number, title, color, icon: Icon }) {
  const theme = sectionThemes[color];
  return (
    <div className="flex items-center gap-2 mb-4">
      <div
        className={`w-6 h-6 rounded-full ${theme.bg} ${theme.text} flex items-center justify-center`}
      >
        <Icon className="w-3.5 h-3.5" strokeWidth={2.5} />
      </div>
      <h3 className={`text-xs font-bold tracking-wide uppercase ${theme.text}`}>
        {number}. {title}
      </h3>
    </div>
  );
}

const emptyForm = {
  complaintSource: "",
  customerName: "",
  productName: "",
  productStrength: "",
  batchNumber: "",
  manufacturingDate: "",
  expiryDate: "",
  quantityAffected: "",
  quantityUnit: "Kg",
  complaintType: "",
  complaintDate: "",
  description: "",
  severity: "",
  priority: "",
};

function fromBackendFields(fields) {
  return {
    complaintSource: fields.complaint_source || "",
    customerName: fields.customer_name || "",
    productName: fields.product_name || "",
    productStrength: fields.product_strength || "",
    batchNumber: fields.batch_number || "",
    manufacturingDate: fields.manufacturing_date || "",
    expiryDate: fields.expiry_date || "",
    quantityAffected: fields.quantity_affected || "",
    complaintType: fields.complaint_type || "",
    complaintDate: fields.complaint_date || "",
    description: fields.description || "",
    severity: fields.severity || "",
    priority: fields.priority || "",
  };
}

function ComplaintDashboard() {
  const [form, setForm] = useState(emptyForm);
  const [messages, setMessages] = useState([
    {
      text: "Upload a complaint document or paste text above. I will automatically extract the details and populate the form for you.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const [extracting, setExtracting] = useState(false);
  const [extractionPercent, setExtractionPercent] = useState(undefined);
  const [extractionNote, setExtractionNote] = useState(null);

  const [showPasteBox, setShowPasteBox] = useState(false);
  const [pasteText, setPasteText] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleReset = () => {
    setForm(emptyForm);
    setSaveStatus(null);
    setExtractionNote(null);
    setExtractionPercent(undefined);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus(null);

    try {
      const res = await fetch(`${API_BASE}/complaints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error(`Server responded ${res.status}`);
      }

      const data = await res.json();

      setSaveStatus({
        type: "success",
        text: data.message || "Complaint saved successfully.",
      });

      // Clear form after successful save
      setForm(emptyForm);

      setExtractionNote(null);
      setExtractionPercent(undefined);
    } catch (err) {
      setSaveStatus({
        type: "error",
        text: `Could not save (${err.message}).`,
      });
    } finally {
      setSaving(false);
    }
  };

  const runExtraction = async ({ file, text }) => {
    setExtracting(true);
    setExtractionPercent(10);
    setExtractionNote(null);
    try {
      const body = new FormData();
      if (file) body.append("file", file);
      if (text) body.append("text", text);

      setExtractionPercent(40);
      const res = await fetch(`${API_BASE}/api/ai/extract`, {
        method: "POST",
        body,
      });
      setExtractionPercent(80);
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const data = await res.json();

      setForm((prev) => ({ ...prev, ...fromBackendFields(data.fields) }));
      setExtractionPercent(100);
      setExtractionNote(data.confidence || "Extraction complete.");
      setMessages((prev) => [
        ...prev,
        {
          text:
            data.confidence || "I've populated the form from your document.",
        },
      ]);
    } catch (err) {
      setExtractionNote(
        `Extraction failed (${err.message}). Is the backend running at ${API_BASE}?`,
      );
    } finally {
      setExtracting(false);
    }
  };

  const handleFileSelect = (file) => runExtraction({ file });
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };
  const handlePasteSubmit = () => {
    if (!pasteText.trim()) return;
    runExtraction({ text: pasteText });
    setShowPasteBox(false);
    setPasteText("");
  };

  const handleSendMessage = async () => {
    const text = chatInput.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { text, fromUser: true }]);
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const data = await res.json();
      setMessages((prev) => [...prev, { text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          text: `Couldn't reach the AI backend (${err.message}). Is it running at ${API_BASE}?`,
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="flex flex-1 min-w-0 overflow-hidden">
      <div className="flex-1 min-w-0 overflow-y-auto p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Log Customer Complaint
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              API &amp; FDF Quality Assurance Module
            </p>
          </div>
          <span className="text-[11px] font-semibold bg-amber-100 text-amber-700 rounded-full px-2.5 py-1">
            Pending Triage
          </span>
        </div>

        <div className="mb-4">
          <SectionHeader
            number={1}
            title="Origin & Customer Details"
            color="blue"
            icon={User}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              label="Complaint Source"
              name="complaintSource"
              value={form.complaintSource}
              onChange={handleChange}
              placeholder="Select Source"
              options={["Email", "Phone", "Portal", "Field Rep"]}
            />
            <FormInput
              label="Customer Name"
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              placeholder="Enter customer name"
            />
          </div>
        </div>

        <div className="mb-4">
          <SectionHeader
            number={2}
            title="Product & Batch Identification"
            color="green"
            icon={Package}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Product Name"
              name="productName"
              value={form.productName}
              onChange={handleChange}
              placeholder="Enter product name"
            />
            <FormInput
              label="Product Strength/Grade"
              name="productStrength"
              value={form.productStrength}
              onChange={handleChange}
              placeholder="Enter strength / grade"
            />
            <FormInput
              label="Batch/Lot Number"
              name="batchNumber"
              value={form.batchNumber}
              onChange={handleChange}
              placeholder="Enter batch / lot number"
            />
            <FormInput
              label="Manufacturing Date"
              name="manufacturingDate"
              type="date"
              value={form.manufacturingDate}
              onChange={handleChange}
            />
            <FormInput
              label="Expiry Date"
              name="expiryDate"
              type="date"
              value={form.expiryDate}
              onChange={handleChange}
            />
            <QuantityInput
              label="Quantity Affected"
              name="quantityAffected"
              value={form.quantityAffected}
              unit={form.quantityUnit}
              onChange={handleChange}
              onUnitChange={(e) =>
                setForm({ ...form, quantityUnit: e.target.value })
              }
            />
          </div>
        </div>

        <div className="mb-4">
          <SectionHeader
            number={3}
            title="Complaint Details"
            color="orange"
            icon={AlertTriangle}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              label="Complaint Type"
              name="complaintType"
              value={form.complaintType}
              onChange={handleChange}
              placeholder="Select type"
              options={[
                "Adverse Event",
                "Product Defect",
                "Packaging Issue",
                "Efficacy Concern",
              ]}
            />
            <FormInput
              label="Complaint Date"
              name="complaintDate"
              type="date"
              value={form.complaintDate}
              onChange={handleChange}
            />
            <div className="col-span-2">
              <FormInput
                label="Detailed Complaint Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the complaint in detail..."
                textarea
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <SectionHeader
            number={4}
            title="Initial Assessment & Priority"
            color="pink"
            icon={ShieldAlert}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              label="Initial Severity"
              name="severity"
              value={form.severity}
              onChange={handleChange}
              placeholder="Select severity"
              options={["Critical", "Major", "Minor"]}
            />
            <FormSelect
              label="Priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
              placeholder="Select priority"
              options={["High", "Medium", "Low"]}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleReset}
            disabled={saving}
            className="flex items-center gap-2 border border-gray-300 text-gray-600 text-sm font-medium rounded-lg px-4 py-2.5 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Form
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg px-4 py-2.5 transition-colors disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Saving..." : "Save Complaint"}
          </button>
        </div>

        {saveStatus && (
          <p
            className={`text-sm mt-3 ${saveStatus.type === "success" ? "text-green-600" : "text-red-600"}`}
          >
            {saveStatus.text}
          </p>
        )}
      </div>

      <aside className="w-[340px] bg-white border-l border-gray-200 p-4 flex flex-col gap-4 shrink-0 overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h3 className="font-semibold text-gray-900 text-sm">
              AI Complaint Intake Assistant
            </h3>
          </div>
          <span className="text-[10px] font-bold bg-indigo-100 text-indigo-600 rounded-full px-2 py-0.5">
            BETA
          </span>
        </div>

        <label
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-indigo-300 bg-indigo-50/40 rounded-xl py-8 px-4 cursor-pointer hover:bg-indigo-50 transition-colors"
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
              e.target.files?.[0] && handleFileSelect(e.target.files[0])
            }
          />
        </label>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {!showPasteBox ? (
          <button
            onClick={() => setShowPasteBox(true)}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Paste Complaint Text / Email
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              rows={4}
              placeholder="Paste the complaint email or text here..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex gap-2">
              <button
                onClick={handlePasteSubmit}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg py-2"
              >
                Extract
              </button>
              <button
                onClick={() => setShowPasteBox(false)}
                className="flex-1 border border-gray-300 text-gray-600 text-sm font-medium rounded-lg py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-3 py-2 text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Supported formats: PDF, DOCX, TXT, EML — Max file size: 10MB
        </div>

        {extractionPercent !== undefined && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-gray-500 tracking-wide uppercase">
                Extraction Progress
              </span>
              <span className="text-xs font-semibold text-indigo-600">
                {extractionPercent}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${extractionPercent}%` }}
              />
            </div>
            {extractionNote && (
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                {extractionNote}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col">
          <p className="text-xs font-semibold text-gray-500 tracking-wide uppercase mb-2">
            AI Assistant
          </p>
          <div className="space-y-3 mb-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 rounded-lg p-3 ${msg.fromUser ? "bg-gray-100 flex-row-reverse text-right" : "bg-indigo-50"}`}
              >
                {!msg.fromUser && (
                  <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                <p className="text-sm text-gray-700 leading-relaxed">
                  {msg.text}
                </p>
              </div>
            ))}
            {chatLoading && (
              <p className="text-xs text-gray-400 px-1">AI is thinking...</p>
            )}
          </div>

          <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask me anything about this complaint..."
              className="flex-1 text-sm outline-none placeholder-gray-400"
            />
            <button
              onClick={handleSendMessage}
              disabled={chatLoading}
              className="w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center shrink-0 transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
          <p className="text-[11px] text-gray-400 text-center mt-2">
            AI responses may contain errors. Please verify information.
          </p>
        </div>
      </aside>
    </div>
  );
}

export default ComplaintDashboard;
