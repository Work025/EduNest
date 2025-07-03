// src/Components/LiveChat/LiveChat.jsx
import React, { useEffect, useState } from 'react';
import socket from '../../socket';

const LiveChat = ({ user }) => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;
    socket.emit('send_message', {
      user: user?.name || 'Guest',
      text: message,
    });
    setMessage('');
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '20px' }}>
      <h3>Live Chat</h3>
      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {chat.map((msg, idx) => (
          <p key={idx}><strong>{msg.user}:</strong> {msg.text}</p>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default LiveChat;
