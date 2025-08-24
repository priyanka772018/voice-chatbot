import { useState, useRef } from "react";

export default function MicButton({ onReply }) {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        chunksRef.current = [];

        onReply({ from: "You", text: "🎤 Voice message..." });

        const formData = new FormData();
        formData.append("file", audioBlob, "recording.webm");

        try {
          const res = await fetch("http://localhost:5000/api/voice", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          const replyText = data?.text || data?.reply || "⚠️ No response";
          onReply({ from: "AI", text: replyText });
        } catch (err) {
          console.error("Voice upload error:", err);
          onReply({ from: "AI", text: "⚠️ Voice upload failed" });
        }
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setRecording(true);
    } catch (err) {
      console.error("Mic access error:", err);
      alert("Microphone access is required.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <button
      onClick={recording ? stopRecording : startRecording}
      className={`px-4 py-2 rounded-lg shadow transition ${
        recording ? "bg-red-500 hover:bg-red-600 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"
      }`}
    >
      {recording ? "🛑 Stop" : "🎤 Speak"}
    </button>
  );
}
