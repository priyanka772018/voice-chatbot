export default function ChatUI({ messages }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg h-80 overflow-y-auto border border-gray-200 shadow-inner">
      {messages.length === 0 && (
        <div className="text-sm text-gray-400 text-center mt-10">
          Start by typing or pressing Speak 🎤
        </div>
      )}

      <div className="space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.from === "You" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-sm
                ${msg.from === "You"
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-900 rounded-bl-none"
                }`}
            >
              <div className="text-xs font-medium opacity-80 mb-1">{msg.from}</div>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
