import React, { useEffect, useState, useRef, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { UserContext } from '../context/UserContext';
import DiceRoller from '../components/DiceRoller';
import MapGrid from '../components/MapGrid';

const socket = io(process.env.REACT_APP_API_BASE);

const Tabletop = () => {
  const { campaignId } = useParams();
  const { user } = useContext(UserContext);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [campaign, setCampaign] = useState(null);
  const chatRef = useRef(null);

  // 🧠 Join campaign room and listen for messages
  useEffect(() => {
    socket.emit('join-campaign', campaignId);

    socket.on('chat-message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off('chat-message');
    };
  }, [campaignId]);

  // 📦 Fetch campaign info for GM detection
  useEffect(() => {
    const fetchCampaign = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/campaigns/${campaignId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setCampaign(data);
      } else {
        console.error('Failed to fetch campaign');
      }
    };

    fetchCampaign();
  }, [campaignId]);

  // 👑 Determine GM status
  const isGM = user && campaign && (
    user._id === campaign.gm || user._id === campaign.gm?._id
  );

  // 👁 Scroll to newest message
  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // 📤 Send chat message
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

  // 🎲 Handle dice roll
  const handleRoll = ({ dice, quantity, modifier }) => {
    const username = user?.username || user?.displayName || 'Unknown Player';
    const max = parseInt(dice.replace('d', ''), 10);
    const rolls = Array.from({ length: quantity }, () => Math.floor(Math.random() * max) + 1);
    const total = rolls.reduce((sum, val) => sum + val, 0) + modifier;

    const message = `🎲 ${username} rolled ${quantity}${dice}${modifier !== 0 ? (modifier > 0 ? ` + ${modifier}` : ` - ${Math.abs(modifier)}`) : ''}: (${rolls.join(' + ')})${modifier !== 0 ? ` ${modifier > 0 ? '+' : '-'} ${Math.abs(modifier)}` : ''} = ${total}`;

    const audio = new Audio('/sounds/diceroll.mp3');
    audio.play().catch((err) => console.warn('Dice roll sound failed:', err));

    socket.emit('chat-message', {
      campaignId,
      username,
      message,
      type: 'roll',
      diceType: dice,
      rolls,
      isNat20: dice === 'd20' && rolls.length === 1 && rolls[0] === 20,
      isNat1: dice === 'd20' && rolls.length === 1 && rolls[0] === 1,
    });
  };

  // 🐞 Debug log
  useEffect(() => {
    console.log('👤 User:', user);
    console.log('🎯 Campaign:', campaign);
    console.log('🧠 isGM:', isGM);
  }, [user, campaign]);

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

      {/* Tabletop Main Area */}
      <div className="flex-grow overflow-auto bg-black p-16">
      {campaign && (
          <MapGrid campaign={campaign} isGM={isGM} />
        )}
      </div>

      {/* Right Sidebar Chat */}
      <div className="w-80 bg-gray-800 border-l border-gray-700 p-4 flex-shrink-0 flex flex-col">
        <h2 className="text-lg font-bold mb-4">💬 Chat & Rolls</h2>
        <div ref={chatRef} className="flex-grow overflow-y-auto bg-black/20 rounded p-2 mb-2 space-y-1">
          {messages.map((msg, i) => {
            let bg = '';
            let text = 'text-gray-300';

            if (msg.type === 'roll') {
              if (msg.isNat20) {
                bg = 'bg-green-700';
                text = 'text-green-100';
              } else if (msg.isNat1) {
                bg = 'bg-red-700';
                text = 'text-red-100';
              } else if (msg.diceType === 'd20') {
                bg = 'bg-yellow-900';
                text = 'text-yellow-300';
              } else {
                bg = 'bg-purple-800';
                text = 'text-purple-100';
              }
            }

            return (
              <p key={i} className={`text-sm px-2 py-1 rounded ${bg} ${text}`}>
                <span className="font-bold text-blue-400">{msg.username}:</span> {msg.message}
              </p>
            );
          })}
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
