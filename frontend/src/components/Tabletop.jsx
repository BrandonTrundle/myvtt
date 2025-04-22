import React, { useEffect, useState, useRef, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { UserContext } from '../context/UserContext';
import DiceRoller from '../components/DiceRoller';

const socket = io(process.env.REACT_APP_API_BASE);

const Tabletop = () => {
  const { campaignId } = useParams();
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatRef = useRef(null);

  useEffect(() => {
    socket.emit('join-campaign', campaignId);

    socket.on('chat-message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off('chat-message');
    };
  }, [campaignId]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const username = user?.username || user?.displayName || 'Unknown Player';

    socket.emit('chat-message', {
      campaignId,
      username,
      message: input.trim(),
      type: 'chat',
    });

    setInput('');
  };

  const handleRoll = ({ dice, quantity, modifier }) => {
    const username = user?.username || user?.displayName || 'Unknown Player';
  
    const max = parseInt(dice.replace('d', ''), 10);
    const rolls = Array.from({ length: quantity }, () => Math.floor(Math.random() * max) + 1);
    const total = rolls.reduce((sum, val) => sum + val, 0) + modifier;
  
    const message = `🎲 ${username} rolled ${quantity}${dice}${modifier !== 0 ? (modifier > 0 ? ` + ${modifier}` : ` - ${Math.abs(modifier)}`) : ''}: (${rolls.join(' + ')})${modifier !== 0 ? ` ${modifier > 0 ? '+' : '-'} ${Math.abs(modifier)}` : ''} = ${total}`;
  
    // 🎧 Play sound
    const audio = new Audio('/sounds/diceroll.mp3');
    audio.play().catch((err) => console.warn('Dice roll sound failed:', err));
  
    // 🧠 Emit roll
    socket.emit('chat-message', {
      campaignId,
      username,
      message,
      type: 'roll',
    });
  };
  

  return (
    <div className="w-screen h-screen flex bg-gray-900 text-white overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 p-4 flex-shrink-0">
        <h2 className="text-lg font-bold mb-4">🧰 Tools</h2>
        <ul className="space-y-2 text-sm">
          <li>🗺️ Map Layers</li>
          <li>📦 Objects</li>
          <li>📐 Ruler</li>
          <li>🎯 Targeting</li>
        </ul>
      </div>

      {/* Main Table Area */}
      <div className="flex-grow p-4 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Welcome to the Tabletop</h1>
          <p className="text-gray-300 text-sm">Campaign ID: {campaignId}</p>
        </div>
      </div>

      {/* Right Chat Panel */}
      <div className="w-80 bg-gray-800 border-l border-gray-700 p-4 flex-shrink-0 flex flex-col">
        <h2 className="text-lg font-bold mb-4">💬 Chat & Rolls</h2>
        <div ref={chatRef} className="flex-grow overflow-y-auto bg-black/20 rounded p-2 mb-2 space-y-1">
          {messages.map((msg, i) => (
            <p
              key={i}
              className={`text-sm ${
                msg.type === 'roll'
                  ? 'bg-yellow-900 text-yellow-300 px-2 py-1 rounded'
                  : 'text-gray-300'
              }`}
            >
              <span className="font-bold text-blue-400">{msg.username}:</span> {msg.message}
            </p>
          ))}
        </div>
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            placeholder="Send a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow px-3 py-2 rounded bg-gray-700 border border-gray-600 text-sm focus:outline-none"
          />
          <button
            type="submit"
            className="bg-arcanared hover:bg-arcanabrown text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </form>
      </div>

      <DiceRoller onRoll={handleRoll} />
    </div>
  );
};

export default Tabletop;
