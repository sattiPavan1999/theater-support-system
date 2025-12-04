import { useState } from "react";
import { askTheaterAgent } from "./api";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoading(true);
    const response = await askTheaterAgent(question);
    setAnswer(response);
    setLoading(false);
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>🎬 Hyderabad Theater Support</h1>

      <input
        type="text"
        placeholder="Ask something about theaters..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={{
          width: "400px",
          padding: "10px",
          fontSize: "18px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />

      <button
        onClick={handleAsk}
        style={{
          marginLeft: "10px",
          padding: "10px 20px",
          fontSize: "18px",
          cursor: "pointer",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Ask
      </button>

      <div style={{ marginTop: "30px", fontSize: "20px" }}>
        {loading ? "⏳ Loading..." : answer}
      </div>
    </div>
  );
}

export default App;
