import React, { useState } from "react";
import ChatUI from "./components/ChatUI";
import MicButton from "./components/MicButton";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const addMessage = (msg) => setMessages((prev) => [...prev, msg]);

  const speakText = (text) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    window.speechSynthesis.speak(u);
  };

  const sendMessage = async (userMessage) => {
    if (!userMessage.trim()) return;
    addMessage({ from: "You", text: userMessage });
    setInput("");

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      const reply = data.reply || "⚠️ No response from backend";
      addMessage({ from: "AI", text: reply });
      speakText(reply);
    } catch (err) {
      addMessage({ from: "AI", text: "⚠️ Error contacting backend." });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold text-indigo-700">Revolt AI Chatbot</h1>
          <p className="text-sm text-gray-500 mt-1">
            Voice + Text assistant for Revolt Motors
          </p>
        </header>

        {/* Chat Window */}
        <ChatUI messages={messages} />

        {/* Controls */}
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow transition"
          >
            Send
          </button>
          <MicButton
            onReply={(msg) => {
              addMessage(msg);
              if (msg.from === "AI") speakText(msg.text);
            }}
          />
          <button
            type="button"
            onClick={() => window.speechSynthesis.cancel()}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow transition"
          >
            Stop
          </button>
        </form>
      </div>
    </div>
  );
}
