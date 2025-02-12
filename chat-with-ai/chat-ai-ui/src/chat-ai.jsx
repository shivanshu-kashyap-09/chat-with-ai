import React, { useState } from "react";
import axios from "axios";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSendMessage = async () => {
    if (input.trim() === "") return;
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await axios.get("http://tomcat.localhost:8080/chat/ai", {
        params: { message: input },
      });
      setMessages((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }finally {
      setInput("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen min-w-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-md w-full max-w-lg p-4 flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto mb-4 max-h-[500px] max-w-screen">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`my-2 p-3 rounded-lg max-w-xs ${
                message.sender === "user"
                  ? "ml-auto bg-blue-500 text-white w-[45%] mr-[10px]"
                  : "mr-auto bg-gray-200 text-gray-800"
              }`}
            >
              {message.sender === "user" ? message.text : message}
            </div>
          ))}
        </div>

        {/* Input and Send */}
        <div className="flex ">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border border-gray-300 text-black rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
