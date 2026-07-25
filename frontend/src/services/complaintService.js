import api from "./api";

export const createComplaint = async (data) => {
  const response = await api.post("/complaints", data);
  return response.data;
};

export const getComplaints = async () => {
  const response = await api.get("/complaints");
  return response.data;
};

export const uploadComplaint = async (formData) => {
  const response = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const askAI = async (message) => {
  const response = await api.post("/chat", {
    message,
  });

  return response.data;
};
