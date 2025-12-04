import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000", // Backend URL
});

export const askTheaterAgent = async (question) => {
  const res = await API.post("/ask", { query: question });
  return res.data.answer;
};
