import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import "./Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Initial greeting from bot
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          text: "Hi there! 👋 I'm ChatFin, your financial assistant. How can I help you today?",
          sender: "bot",
        },
      ]);
    }
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true); // Show thinking status

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/chat", {
        message: input,
      });

      const fullReply = response.data.reply;
      setIsTyping(false);
      let currentText = "";
      const typingSpeed = 30; // ms per letter

      // Add placeholder bot message
      setMessages([...newMessages, { text: "", sender: "bot" }]);

      for (let i = 0; i <= fullReply.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, typingSpeed));
        currentText = fullReply.slice(0, i);

        setMessages((prevMessages) => {
          const updated = [...prevMessages];
          updated[updated.length - 1] = { text: currentText, sender: "bot" };
          return updated;
        });
      }

      
    } catch (error) {
      console.error("Error sending message:", error);
      setIsTyping(false);
    }
  };

  return (
    <div className="chatbot-wrapper">
      <motion.div
        className="chatbot-container"
        animate={{
          height: isOpen ? "400px" : "50px",
          width: isOpen ? "500px" : "300px",
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <div className="chatbot-header">
          🤖 ChatFin
          <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="chatbot-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="chatbot-messages">
                {messages.map((msg, index) => (
                  <div key={index} className={`chatbot-message ${msg.sender}`}>
                    {msg.text}
                  </div>
                ))}

                {isTyping && (
                  <div className="chatbot-message bot thinking">
                    ChatFin is thinking...
                  </div>
                )}
              </div>

              <div className="chatbot-input">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                />
                <button onClick={sendMessage}>Send</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Chatbot;
