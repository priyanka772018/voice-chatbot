import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { askGemini } from "./utils/geminiClient.js";
import voiceRouter from "./routes/voice.js"; // ✅ import default export properly

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Text chatbot route
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    const reply = await askGemini(message);
    res.json({ reply });
  } catch (err) {
    console.error("❌ Chat route error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Voice chatbot route (mounted under /api/voice)
app.use("/api", voiceRouter);

// Root test
app.get("/", (req, res) => {
  res.send("✅ Gemini Voice Chatbot Backend is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Backend running on http://localhost:${PORT}`)
);
