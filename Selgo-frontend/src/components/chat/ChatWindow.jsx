import React, { useState, useEffect, useRef } from 'react';
import chatService from '../../services/chatService';
import useAuthStore from '../../store/store';

const ChatWindow = ({ conversationId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuthStore();
  const ws = useRef(null);

  useEffect(() => {
    if (user && conversationId) {
      ws.current = chatService.connectWebSocket(conversationId, user.id, (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        if (ws.current) {
          ws.current.close();
        }
      };
    }
  }, [user, conversationId]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (conversationId) {
        const fetchedMessages = await chatService.getMessages(conversationId);
        setMessages(fetchedMessages);
      }
    };
    fetchMessages();
  }, [conversationId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !ws.current) return;

    ws.current.send(JSON.stringify({ content: newMessage }));
    setNewMessage('');
  };

  return (
    <div className="chat-window">
      <div className="messages-list">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender_id === user?.id ? 'sent' : 'received'}`}>
            <p>{message.content}</p>
            <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatWindow;
