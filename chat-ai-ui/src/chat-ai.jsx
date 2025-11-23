import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check, Send } from "lucide-react";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typingMessage, setTypingMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingMessage]);

  const typeText = async (text) => {
    setIsTyping(true);
    let i = 0;
    let typed = "";
    const interval = setInterval(() => {
      typed += text.charAt(i);
      setTypingMessage(typed);
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          { text, sender: "ai", time: new Date() },
        ]);
        setTypingMessage("");
      }
    }, 15);
  };

  const handleSendMessage = async () => {
    if (input.trim() === "") return;
    const userMessage = { text: input, sender: "user", time: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await axios.get("http://localhost:8080/chat/ai", {
        params: { message: input },
      });

      const aiText =
        typeof response.data === "string"
          ? response.data
          : JSON.stringify(response.data, null, 2);
      await typeText(aiText);
    } catch (error) {
      await typeText("⚠️ Something went wrong. Please try again.");
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const formatDate = (date) =>
    new Date(date).toLocaleDateString([], { day: "2-digit", month: "short" });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] p-4 w-full">
      <div className="w-full max-w-[850px] h-[94vh] flex flex-col bg-[#0b1120]/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.4)] overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-center items-center py-2 border-b border-white/10 bg-[#1e293b]/60 text-white font-semibold tracking-wide text-lg shadow-md">
          <span className="text-blue-400 text-xl">🤖</span> AI Chat Assistant
        </div>

        {/* CHAT BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 scrollbar-hide">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`relative group max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed shadow-md transition-all duration-300 ${
                message.sender === "user"
                  ? "ml-auto border w-50 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-none"
                  : "mr-auto bg-white/10 text-gray-100 rounded-bl-none border border-white/10"
              }`}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.text}
              </ReactMarkdown>

              <div
                className={`text-[11px] mt-2 ${
                  message.sender === "user"
                    ? "text-blue-200 text-right"
                    : "text-gray-400 text-left"
                }`}
              >
                {formatDate(message.time)} • {formatTime(message.time)}
              </div>

              {message.sender === "ai" && (
                <button
                  onClick={() => handleCopy(message.text, index)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
                >
                  {copiedIndex === index ? (
                    <Check size={16} className="text-green-500" />
                  ) : (
                    <Copy size={16} className="text-gray-400 hover:text-gray-100" />
                  )}
                </button>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="mr-auto bg-white/10 text-gray-200 p-4 rounded-2xl max-w-[75%] border border-white/10 shadow-sm animate-pulse">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {typingMessage + "▌"}
              </ReactMarkdown>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* INPUT BAR */}
        <div className="flex items-center gap-3 border-t border-white/10 p-4 bg-[#0b1120]/80 backdrop-blur-xl">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 bg-white/10 text-gray-100 placeholder-gray-400 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/10"
          />
          <button
            onClick={handleSendMessage}
            className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-5 py-3 rounded-xl shadow-lg transition-all duration-200"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
