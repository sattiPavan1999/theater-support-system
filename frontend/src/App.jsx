import { useState } from "react";
import { askTheaterAgent } from "./api";

function App() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]); // <-- chat history
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;

    // Add user message to chat
    const newMessage = { sender: "user", text: question };
    setMessages((prev) => [...prev, newMessage]);

    setLoading(true);

    // Call backend
    const response = await askTheaterAgent(question);

    // Add AI response to chat
    const aiMessage = { sender: "ai", text: response };
    setMessages((prev) => [...prev, aiMessage]);

    setLoading(false);

    // Keep the message visible in chat, but clear input box
    setQuestion("");
  };

  return (
  <div
    style={{
      height: "100vh",
      width: "100vw",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#0e0b0bff",
      padding: "20px",
      boxSizing: "border-box",
    }}
  >
    {/* CHAT CONTAINER */}
    <div
      style={{
        width: "100%",
        maxWidth: "600px",
        backgroundColor: "white",
        borderRadius: "15px",
        padding: "20px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h1 style={{ textAlign: "center", color: "black" }}>🤖 Create a Story</h1>

      {/* CHAT WINDOW */}
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "15px",
          height: "400px",
          overflowY: "scroll",
          backgroundColor: "#f9f9f9",
          marginBottom: "20px",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: "15px",
              textAlign: msg.sender === "user" ? "right" : "left",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "10px",
                borderRadius: "10px",
                backgroundColor:
                  msg.sender === "user" ? "#007bff" : "#e6e6e6",
                color: msg.sender === "user" ? "white" : "black",
                maxWidth: "80%",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && <p>⏳ AI is thinking...</p>}
      </div>

      {/* INPUT + BUTTON */}
      <div style={{ display: "flex" }}>
        <input
          type="text"
          placeholder="Type your message..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={{
            flex: 1,
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
            backgroundColor: "green",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Send
        </button>
      </div>
    </div>
  </div>
);

}

export default App;
