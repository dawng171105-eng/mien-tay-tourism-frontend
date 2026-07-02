import { useState } from "react";

const initialMessages = [
  { from: "bot", text: "👋 Chào bạn! Chúng tôi có thể giúp gì cho bạn?" },
  {
    from: "bot",
    text: "Bạn có thể hỏi về: đặt tour, giá tour, lịch trình, khuyến mãi...",
  },
];

const quickReplies = [
  "🎯 Tư vấn tour miền Tây",
  "💰 Bảng giá tour",
  "📅 Lịch khởi hành",
  "🎁 Khuyến mãi",
  "📞 Gọi hotline",
];

export default function LiveChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");

  const sendMessage = (text) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { from: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Cảm ơn bạn đã quan tâm! Nhân viên tư vấn của chúng tôi sẽ phản hồi trong giây lát. Bạn cũng có thể gọi hotline 1900 1234 để được hỗ trợ nhanh nhất.",
        },
      ]);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage(input);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-river-600 text-white rounded-full shadow-lg hover:bg-river-700 transition flex items-center justify-center"
        aria-label="Live chat"
      >
        {open ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-80 sm:w-96 bg-white rounded-xl border shadow-2xl flex flex-col overflow-hidden animate-slide-up">
          <div className="bg-river-600 text-white p-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm">💬 Tư vấn trực tuyến</h3>
              <p className="text-xs text-river-200">
                Chúng tôi phản hồi trong vài phút
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white hover:text-river-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 p-4 space-y-3 max-h-80 overflow-y-auto bg-slate-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${msg.from === "user" ? "bg-river-600 text-white rounded-br-md" : "bg-white border text-slate-700 rounded-bl-md"}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-2 border-t flex flex-wrap gap-1">
            {quickReplies.map((qr, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(qr)}
                className="text-xs px-2 py-1 bg-river-50 text-river-700 rounded-full hover:bg-river-100 transition"
              >
                {qr}
              </button>
            ))}
          </div>
          <div className="p-3 border-t flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập tin nhắn..."
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-river-500"
            />
            <button
              onClick={() => sendMessage(input)}
              className="px-4 py-2 bg-river-600 text-white rounded-lg text-sm hover:bg-river-700 transition"
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </>
  );
}
