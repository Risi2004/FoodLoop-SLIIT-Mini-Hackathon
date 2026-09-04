import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import './ChatBotWidget.css';

export default function ChatBotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! 👋 I am LoopBot, your AI Food Rescue Assistant. How can I help you today?'
    }
  ]);
  const [inputVal, setInputVal] = useState('');

  const handleSend = (textToSend) => {
    const query = textToSend || inputVal;
    if (!query.trim()) return;

    const newMsgs = [...messages, { sender: 'user', text: query }];
    setMessages(newMsgs);
    setInputVal('');

    setTimeout(() => {
      let reply = "Our AI system instantly categorizes surplus foods, checks fresh shelf-life, and routes it to the nearest verified NGO within 30 minutes!";
      const q = query.toLowerCase();
      if (q.includes('donate') || q.includes('food')) {
        reply = "To donate, tap 'Login' or 'Donate Food'. You can upload a photo of your surplus meal, and our AI will automatically parse the portions and expiration date!";
      } else if (q.includes('volunteer')) {
        reply = "Volunteers can register to pick up certified donations and deliver them to community centers. Join through our 'Join as Volunteer' button!";
      } else if (q.includes('ngo')) {
        reply = "Registered NGOs receive real-time notifications for nearby food packages ready for dispatch with complete temperature and safety logs.";
      }
      setMessages([...newMsgs, { sender: 'bot', text: reply }]);
    }, 600);
  };

  return (
    <div className="chatbot-wrapper">
      {/* Floating Circular Trigger */}
      <button 
        className={`chatbot-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open AI Assistant"
      >
        {isOpen ? <X size={24} /> : <Bot size={26} />}
        <span className="chatbot-pulse-ring"></span>
      </button>

      {/* Chat Popup Box */}
      {isOpen && (
        <div className="chatbot-dialog">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="bot-avatar">
                <Bot size={20} />
              </div>
              <div>
                <h4>FoodLoop AI Assistant</h4>
                <div className="bot-status-indicator">
                  <span className="online-dot"></span>
                  <span>Online • Instant Help</span>
                </div>
              </div>
            </div>
            <button className="bot-close-btn" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="chatbot-body">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.sender}`}>
                {msg.sender === 'bot' && (
                  <div className="bot-msg-icon">
                    <Sparkles size={14} />
                  </div>
                )}
                <div className="chat-bubble">
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick suggestions */}
          <div className="chatbot-quick-chips">
            <button onClick={() => handleSend("How do I donate food?")}>🍲 Donate Food</button>
            <button onClick={() => handleSend("How does AI verification work?")}>⚡ AI Scanning</button>
            <button onClick={() => handleSend("Join as NGO")}>🏢 NGO Register</button>
          </div>

          {/* Chat Input */}
          <form 
            className="chatbot-input-bar"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input 
              type="text" 
              placeholder="Ask FoodLoop AI..." 
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
            />
            <button type="submit" className="chat-send-btn">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
