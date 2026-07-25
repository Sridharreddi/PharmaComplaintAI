import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:8000";

export default function ComplaintList({ onDeleteSuccess }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/complaints`);

      if (!res.ok) {
        throw new Error("Failed to fetch complaints");
      }

      const result = await res.json();

      setComplaints(result.data || []);
    } catch (err) {
      console.error(err);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this complaint?",
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_BASE}/complaints/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        alert("Complaint deleted successfully");

        setSelectedComplaint(null);

        await fetchComplaints();
        if (onDeleteSuccess) {
          onDeleteSuccess();
        }
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete complaint");
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-6 mt-4">
        Loading complaints...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Saved Complaints</h2>

        <button
          onClick={fetchComplaints}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Refresh
        </button>
      </div>

      <table className="w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Customer</th>
            <th className="border p-2">Product</th>
            <th className="border p-2">Complaint Type</th>
            <th className="border p-2">Severity</th>
            <th className="border p-2">Priority</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {complaints.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center p-6">
                No complaints found
              </td>
            </tr>
          ) : (
            complaints.map((item, index) => (
              <tr key={item.id}>
                <td className="border p-2">{item.id}</td>
                <td className="border p-2">{item.customerName}</td>
                <td className="border p-2">{item.productName}</td>
                <td className="border p-2">{item.complaintType}</td>
                <td className="border p-2">{item.severity}</td>
                <td className="border p-2">{item.priority}</td>

                <td className="border p-2">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => setSelectedComplaint(item)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      View
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {selectedComplaint && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg w-[700px] p-6">
            <h2 className="text-2xl font-bold mb-4">Complaint Details</h2>

            <div className="grid grid-cols-2 gap-4">
              <p>
                <b>Customer:</b> {selectedComplaint.customerName}
              </p>
              <p>
                <b>Product:</b> {selectedComplaint.productName}
              </p>
              <p>
                <b>Strength:</b> {selectedComplaint.productStrength}
              </p>
              <p>
                <b>Batch:</b> {selectedComplaint.batchNumber}
              </p>
              <p>
                <b>ComplaintRequest:</b> {selectedComplaint.complaintType}
              </p>
              <p>
                <b>Severity:</b> {selectedComplaint.severity}
              </p>
              <p>
                <b>Priority:</b> {selectedComplaint.priority}
              </p>
              <p>
                <b>Quantity:</b> {selectedComplaint.quantityAffected}{" "}
                {selectedComplaint.quantityUnit}
              </p>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Description</h3>

              <div className="border rounded-lg p-3 bg-gray-50">
                {selectedComplaint.description}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => handleDelete(selectedComplaint.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>

              <button
                onClick={() => setSelectedComplaint(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
