import React, { useState, useEffect } from "react";
import {
  LuUser,
  LuPackage,
  LuFileText,
  LuTriangleAlert,
  LuRotateCcw,
  LuSave,
  LuLoader,
} from "react-icons/lu";

const API_BASE = "http://localhost:8000";

const initialFormState = {
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

function toBackendPayload(formData) {
  return {
    complaint_source: formData.complaintSource || null,
    customer_name: formData.customerName || null,
    product_name: formData.productName || null,
    product_strength: formData.productStrength || null,
    batch_number: formData.batchNumber || null,
    manufacturing_date: formData.manufacturingDate || null,
    expiry_date: formData.expiryDate || null,
    quantity_affected: formData.quantityAffected || null,
    quantity_unit: formData.quantityUnit || "Kg",
    complaint_type: formData.complaintType || null,
    complaint_date: formData.complaintDate || null,
    description: formData.description || null,
    severity: formData.severity || null,
    priority: formData.priority || null,
  };
}

export default function LogComplaintForm({ onSave, extractedData, resetForm }) {
  const [formData, setFormData] = useState(initialFormState);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  useEffect(() => {
    if (!extractedData) return;

    setFormData((prev) => ({
      ...prev,
      complaintSource: extractedData.complaintSource || prev.complaintSource,

      customerName: extractedData.customerName || prev.customerName,

      productName: extractedData.productName || prev.productName,

      productStrength: extractedData.productStrength || prev.productStrength,

      batchNumber: extractedData.batchNumber || prev.batchNumber,

      manufacturingDate:
        extractedData.manufacturingDate || prev.manufacturingDate,

      expiryDate: extractedData.expiryDate || prev.expiryDate,

      quantityAffected: extractedData.quantityAffected || prev.quantityAffected,

      quantityUnit: extractedData.quantityUnit || prev.quantityUnit,

      complaintType: extractedData.complaintType || prev.complaintType,

      complaintDate: extractedData.complaintDate || prev.complaintDate,

      description: extractedData.description || prev.description,

      severity: extractedData.severity || prev.severity,

      priority: extractedData.priority || prev.priority,
    }));
  }, [extractedData]);
  useEffect(() => {
    setFormData(initialFormState);
    setSaveStatus(null);
  }, [resetForm]); // { type: 'success' | 'error', text }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setSaveStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "complaintSource",
      "customerName",
      "productName",
      "productStrength",
      "batchNumber",
      "manufacturingDate",
      "expiryDate",
      "quantityAffected",
      "complaintType",
      "complaintDate",
      "description",
      "severity",
      "priority",
    ];

    const missingFields = requiredFields.filter(
      (field) => !formData[field] || formData[field].toString().trim() === "",
    );

    if (missingFields.length > 0) {
      setSaveStatus({
        type: "error",
        text: "Please fill all the required fields before submitting.",
      });
      return;
    }
    setSaving(true);
    setSaveStatus(null);

    try {
      console.log("Sending payload:", formData);
      const res = await fetch(`${API_BASE}/complaints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(`Server responded ${res.status}`);
      }

      const data = await res.json();

      setSaveStatus({
        type: "success",
        text: data.message || "Complaint saved successfully.",
      });

      if (onSave) {
        onSave(data);
      }

      // Clear the form after successful save
      setFormData(initialFormState);
    } catch (err) {
      setSaveStatus({
        type: "error",
        text: `Could not save (${err.message})`,
      });
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col h-full overflow-hidden">
      {/* 1. PINNED HEADER */}
      <div className="shrink-0 flex justify-between items-start mb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Log Customer Complaint
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            API & FDF Quality Assurance Module
          </p>
        </div>
        <span className="px-3 py-1 bg-orange-50 border border-orange-200 text-orange-600 text-[11px] font-semibold rounded-full">
          Pending Triage
        </span>
      </div>

      <form
        id="complaint-form"
        onSubmit={handleSubmit}
        className="flex-1 flex flex-col min-h-0 overflow-hidden"
      >
        {/* 2. SCROLLABLE FORM CONTENT */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-1 pb-8">
          {/* SECTION 1: ORIGIN & CUSTOMER DETAILS */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-purple-700 font-bold text-[11px] uppercase tracking-wider">
              <LuUser className="w-3.5 h-3.5" />
              <span>1. Origin & Customer Details</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Complaint Source
                </label>
                <select
                  name="complaintSource"
                  value={formData.complaintSource}
                  onChange={handleChange}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Source</option>
                  <option value="Customer Email">Customer Email</option>
                  <option value="Distributor Portal">Distributor Portal</option>
                  <option value="Regulatory Agency">Regulatory Agency</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  name="customerName"
                  placeholder="Enter customer name"
                  value={formData.customerName}
                  onChange={handleChange}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: PRODUCT & BATCH IDENTIFICATION */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-emerald-600 font-bold text-[11px] uppercase tracking-wider">
              <LuPackage className="w-3.5 h-3.5" />
              <span>2. Product & Batch Identification</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  name="productName"
                  placeholder="Enter product name"
                  value={formData.productName}
                  onChange={handleChange}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Product Strength/Grade
                </label>
                <input
                  type="text"
                  name="productStrength"
                  placeholder="Enter strength / grade"
                  value={formData.productStrength}
                  onChange={handleChange}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Batch/Lot Number
                </label>
                <input
                  type="text"
                  name="batchNumber"
                  placeholder="Enter batch / lot number"
                  value={formData.batchNumber}
                  onChange={handleChange}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Manufacturing Date
                </label>
                <input
                  type="date"
                  name="manufacturingDate"
                  value={formData.manufacturingDate}
                  onChange={handleChange}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Quantity Affected
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="quantityAffected"
                    placeholder="Enter quantity"
                    value={formData.quantityAffected}
                    onChange={handleChange}
                    className="flex-1 min-w-0 text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <select
                    name="quantityUnit"
                    value={formData.quantityUnit}
                    onChange={handleChange}
                    className="shrink-0 w-20 text-sm bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Kg">Kg</option>
                    <option value="Boxes">Boxes</option>
                    <option value="Vials">Vials</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: COMPLAINT DETAILS */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-amber-600 font-bold text-[11px] uppercase tracking-wider">
              <LuFileText className="w-3.5 h-3.5" />
              <span>3. Complaint Details</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Complaint Type
                </label>
                <select
                  name="complaintType"
                  value={formData.complaintType}
                  onChange={handleChange}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Select type</option>
                  <option value="Packaging Defect">Packaging Defect</option>
                  <option value="Product Contamination">
                    Product Contamination
                  </option>
                  <option value="Efficacy Issue">Efficacy Issue</option>
                  <option value="Labeling Error">Labeling Error</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Complaint Date
                </label>
                <input
                  type="date"
                  name="complaintDate"
                  value={formData.complaintDate}
                  onChange={handleChange}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Detailed Complaint Description
              </label>
              <textarea
                name="description"
                rows="2"
                placeholder="Describe the complaint in detail..."
                value={formData.description}
                onChange={handleChange}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />
            </div>
          </div>

          {/* SECTION 4: INITIAL ASSESSMENT & PRIORITY */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-rose-600 font-bold text-[11px] uppercase tracking-wider">
              <LuTriangleAlert className="w-3.5 h-3.5" />
              <span>4. Initial Assessment & Priority</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Initial Severity
                </label>
                <select
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="">Select severity</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="Critical / High">Critical / High</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="">Select priority</option>
                  <option value="Low">P3 - Low</option>
                  <option value="Medium">P2 - Medium</option>
                  <option value="High">P1 - High</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Status message */}
        {saveStatus && (
          <p
            className={`shrink-0 text-sm px-1 pb-2 ${saveStatus.type === "success" ? "text-green-600" : "text-red-600"}`}
          >
            {saveStatus.text}
          </p>
        )}

        {/* 3. PINNED FOOTER */}
        <div className="shrink-0 pt-4 mt-2 border-t border-slate-100 flex justify-between items-center bg-white">
          <button
            type="button"
            onClick={handleReset}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            <LuRotateCcw className="w-4 h-4" />
            Reset Form
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all disabled:opacity-60"
          >
            {saving ? (
              <LuLoader className="w-4 h-4 animate-spin" />
            ) : (
              <LuSave className="w-4 h-4" />
            )}
            {saving ? "Saving..." : "Save Complaint"}
          </button>
        </div>
      </form>
    </div>
  );
}
