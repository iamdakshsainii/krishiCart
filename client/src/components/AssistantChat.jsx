import React, { useState } from "react";

const AssistantChat = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { from: "assistant", text: "नमस्ते! खेती से जुड़ा कोई भी सवाल पूछें।" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY; // or process.env.REACT_APP_OPENAI_API_KEY as per your setup

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { from: "user", text: input }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });
      if (res.status === 429) {
        setMessages((msgs) => [
          ...msgs,
          {
            from: "assistant",
            text:
              "आपका AI सहायक सीमा तक पहुंच गया है। कृपया कुछ समय बाद पुनः प्रयास करें।",
          },
        ]);
      } else if (!res.ok) {
        const errorData = await res.json();
        setMessages((msgs) => [
          ...msgs,
          {
            from: "assistant",
            text: errorData.error || "त्रुटि हुई। कृपया पुनः प्रयास करें।",
          },
        ]);
      } else {
        const data = await res.json();
        setMessages((msgs) => [...msgs, { from: "assistant", text: data.reply }]);
      }
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { from: "assistant", text: "सर्वर से कनेक्ट नहीं हो पाया। कृपया बाद में प्रयास करें।" },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-16 right-4 w-96 bg-white shadow-xl rounded-xl flex flex-col border border-blue-100 z-50">
      {/* Header */}
      <div className="p-3 font-bold text-blue-700 border-b flex justify-between">
        खेती सहायक
        <button onClick={onClose} className="text-red-500">✖</button>
      </div>
      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: "300px" }}>
        {messages.map((m, i) => (
          <div
            key={i}
            className={m.from === "assistant" ? "text-green-700 mb-2" : "text-gray-800 mb-2"}
          >
            {m.text}
          </div>
        ))}
        {loading && <div className="text-gray-400">सोच रहा हूँ...</div>}
      </div>
      {/* Input */}
      <div className="flex border-t p-2 gap-2">
        <input
          className="flex-1 border px-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="सवाल लिखें..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          className="bg-blue-600 text-white px-4 rounded"
          onClick={handleSend}
        >
          भेजें
        </button>
      </div>
    </div>
  );
};

export default AssistantChat;
