import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY || "YOUR_API_KEY_HERE";

async function testGemini() {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: "Explain how AI works in a few words" }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    console.log("✅ Gemini API Response:");
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("❌ Error calling Gemini API:", err.message);
  }
}

testGemini();
