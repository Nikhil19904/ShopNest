import React, { useState, useRef, useEffect } from 'react';
import { FaComment, FaTimes, FaPaperPlane, FaRobot } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const LiveChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! How can we help you today?', sender: 'agent', timestamp: new Date() }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 300);
    }
  }, [isOpen]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate agent response after a delay
    setTimeout(() => {
      const agentResponse = {
        id: messages.length + 2,
        text: getAgentResponse(newMessage),
        sender: 'agent',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, agentResponse]);
      setIsTyping(false);
    }, 1500);
  };

  // Simple response logic - in a real app, this would connect to a backend service
  const getAgentResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'Hi there! How can I assist you today?';
    } else if (lowerMessage.includes('order') || lowerMessage.includes('track')) {
      return 'You can track your order by going to your account and clicking on "Orders". Would you like me to help you with that?';
    } else if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
      return 'Our return policy allows returns within 30 days of delivery. You can initiate a return from your account or I can help you with that.';
    } else if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
      return 'We offer free shipping on orders over $50. Standard delivery takes 3-5 business days.';
    } else if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
      return 'We accept all major credit cards, PayPal, and Apple Pay. Is there a specific payment method you\'re interested in?';
    } else if (lowerMessage.includes('discount') || lowerMessage.includes('coupon') || lowerMessage.includes('promo')) {
      return 'We currently have a 10% off promotion for new customers. Use code WELCOME10 at checkout!';
    } else if (lowerMessage.includes('thank')) {
      return 'You\'re welcome! Is there anything else I can help you with?';
    } else {
      return 'I understand you\'re asking about "' + userMessage + '". Could you please provide more details so I can better assist you?';
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        className="fixed bottom-6 left-6 z-50 bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes size={24} /> : <FaComment size={24} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 left-6 z-50 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            {/* Chat Header */}
            <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
              <div className="flex items-center">
                <FaComment className="mr-2" />
                <h3 className="font-medium">Customer Support</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 focus:outline-none"
              >
                <FaTimes />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200'} rounded-lg p-3 shadow`}>
                    <div className="flex items-start">
                      {message.sender === 'agent' && (
                        <div className="mr-2 mt-1">
                          <FaRobot className="text-indigo-500" />
                        </div>
                      )}
                      <div>
                        <p>{message.text}</p>
                        <p className="text-xs mt-1 opacity-70">{formatTime(message.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start mb-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow">
                    <div className="flex items-center">
                      <FaRobot className="text-indigo-500 mr-2" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white p-2 rounded-r-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <FaPaperPlane />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LiveChatWidget; 