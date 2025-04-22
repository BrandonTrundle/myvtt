// 📂 frontend/pages/Tabletop.jsx
import React, {
  useState,
  useRef,
  useContext,
  useCallback,
  useEffect,
} from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { useSocket } from '../context/SocketContext';
import { SOCKET_EVENTS } from '../constants/SOCKET_EVENTS';

import DiceRoller from '../components/DiceRoller';
import MapGrid from '../components/MapGrid';

import { useChatSocket } from '../hooks/useChatSocket';
import { useCampaignData } from '../hooks/useCampaignData';


const Tabletop = () => {
  const { campaignId } = useParams();
  const { user } = useContext(UserContext);
  const { socket } = useSocket();

  const [campaign, setCampaign] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatRef = useRef(null);

  // 📦 Load campaign data
  useCampaignData(campaignId, setCampaign);

  // 🔁 Socket: listen to incoming messages
  useChatSocket(campaignId, (msg) => setMessages((prev) => [...prev, msg]));

  // 👑 Determine GM status
  const isGM = user && campaign && (
    user._id === campaign.gm || user._id === campaign.gm?._id
  );

  // 👁 Auto-scroll chat to bottom
  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // 📤 Chat message sender
  const handleSend = useCallback((e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const username = user?.username || user?.displayName || 'Unknown Player';

    socket.emit(SOCKET_EVENTS.CHAT_MESSAGE, {
      campaignId,
      username,
      message: input.trim(),
      type: 'chat',
    });

    setInput('');
  }, [campaignId, input, socket, user]);

  // 🎲 Dice roll handler
  const handleRoll = useCallback(({ dice, quantity, modifier }) => {
    const username = user?.username || user?.displayName || 'Unknown Player';
    const max = parseInt(dice.replace('d', ''), 10);
    const rolls = Array.from({ length: quantity }, () => Math.floor(Math.random() * max) + 1);
    const total = rolls.reduce((sum, val) => sum + val, 0) + modifier;

    const message = `🎲 ${username} rolled ${quantity}${dice}${modifier !== 0 ? (modifier > 0 ? ` + ${modifier}` : ` - ${Math.abs(modifier)}`) : ''}: (${rolls.join(' + ')})${modifier !== 0 ? ` ${modifier > 0 ? '+' : '-'} ${Math.abs(modifier)}` : ''} = ${total}`;

    new Audio('/sounds/diceroll.mp3').play().catch((err) =>
      console.warn('Dice roll sound failed:', err)
    );

    socket.emit(SOCKET_EVENTS.CHAT_MESSAGE, {
      campaignId,
      username,
      message,
      type: 'roll',
      diceType: dice,
      rolls,
      isNat20: dice === 'd20' && rolls.length === 1 && rolls[0] === 20,
      isNat1: dice === 'd20' && rolls.length === 1 && rolls[0] === 1,
    });
  }, [campaignId, socket, user]);

  // 🐞 Dev logs
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('👤 User:', user);
      console.log('🎯 Campaign:', campaign);
      console.log('🧠 isGM:', isGM);
    }
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

      {/* Tabletop Canvas */}
      <div className="flex-grow overflow-auto bg-black p-16">
        {campaign && <MapGrid campaign={campaign} isGM={isGM} />}
      </div>

      {/* Chat Sidebar */}
      <div className="w-80 bg-gray-800 border-l border-gray-700 p-4 flex-shrink-0 flex flex-col">
        <h2 className="text-lg font-bold mb-4">💬 Chat & Rolls</h2>
        <div
          ref={chatRef}
          className="flex-grow overflow-y-auto bg-black/20 rounded p-2 mb-2 space-y-1"
        >
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
