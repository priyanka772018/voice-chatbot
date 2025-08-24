import express from "express";
import multer from "multer";
import fetch from "node-fetch";

const router = express.Router();
const upload = multer(); // memory storage

// 🎤 Handle audio upload
router.post("/voice", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    console.log("✅ Received file:", req.file.originalname, req.file.mimetype, req.file.size);

    const base64Audio = req.file.buffer.toString("base64");

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: "Transcribe this audio and answer as Revolt AI Assistant." },
                {
                  inlineData: {
                    mimeType: "audio/webm",
                    data: base64Audio,
                  },
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No response from Gemini";

    console.log("✅ Gemini reply:", reply);
    res.json({ text: reply });
  } catch (err) {
    console.error("❌ Voice API error:", err);
    res.status(500).json({ error: "Voice processing failed" });
  }
});

export default router;
