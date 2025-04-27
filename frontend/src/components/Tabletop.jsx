/**
 * Author: Brandon Trundle
 * File Name: Tabletop.jsx
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Renders the virtual tabletop interface for ArcanaTable campaigns.
 * Handles real-time chat, dice rolling, and battle map display using WebSockets.
 * 
 * Behavior:
 * - Joins the campaign's socket.io room on load.
 * - Loads campaign data via REST API.
 * - Sends and receives chat messages and dice roll results via WebSocket.
 * - Displays a campaign map (with GM privileges if applicable).
 * - Updates UI reactively as campaign/chat state changes.
 * 
 * Features:
 * - Chat sidebar with auto-scrolling.
 * - Dice roller integrated with real-time messaging.
 * - Map grid with GM/player view separation.
 * 
 * Props:
 * - None (uses hooks internally to retrieve context and URL params).
 */

import React, { useState, useRef, useContext, useCallback, useEffect } from 'react'; // React imports for state management, refs, context, lifecycle, and callbacks
import { useParams } from 'react-router-dom'; // React Router hook for accessing URL parameters
import { UserContext } from '../context/UserContext'; // Context providing user authentication data
import { useSocket } from '../context/SocketContext'; // Context providing socket.io real-time communication
import { SOCKET_EVENTS } from '../constants/SOCKET_EVENTS'; // Socket event constants
import DiceRoller from '../components/DiceRoller'; // Component for rolling dice and sending roll events
import MapGrid from '../components/MapGrid'; // Component for rendering the campaign's battle map
import { useChatSocket } from '../hooks/useChatSocket'; // Hook for handling chat socket communication
import { useCampaignData } from '../hooks/useCampaignData'; // Hook for loading and managing campaign data

/**
 * Tabletop Page Component
 * 
 * Renders the ArcanaTable virtual tabletop session, including chat, dice rolling, and the map grid.
 * Manages all relevant real-time events, WebSocket connections, and user interactions.
 * 
 * @returns {JSX.Element} - The full tabletop interface layout.
 */
const Tabletop = () => {
  const { campaignId } = useParams();
  const { user } = useContext(UserContext);
  const { socket, joinCampaign } = useSocket();

  const [campaign, setCampaign] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatRef = useRef(null);

/**
 * Fetches campaign data from server and updates local state.
 * 
 * @param {string} campaignId - The ID of the current campaign.
 * @param {Function} setCampaign - React state setter to store campaign data.
 */
  useCampaignData(campaignId, setCampaign);

/**
 * Callback to append a new incoming message to the chat log.
 * 
 * @param {Object} msg - The chat message object.
 */
  const handleIncomingMessage = useCallback(
    (msg) => setMessages((prev) => [...prev, msg]),
    []
  );

/**
 * Subscribes to chat messages for the given campaign using WebSocket.
 * 
 * @param {string} campaignId - Current campaign ID.
 * @param {Function} handleIncomingMessage - Handler for incoming chat messages.
 */
  useChatSocket(campaignId, handleIncomingMessage);

/**
 * Checks if the current user is the GM (Game Master) for this campaign.
 * 
 * @returns {boolean} - True if user is GM, otherwise false.
 */
  const isGM = user && campaign && (
    user._id === campaign.gm || user._id === campaign.gm?._id
  );

/**
 * Joins the socket.io room for the current campaign.
 * 
 * @param {string} campaignId - Current campaign ID.
 * @param {Socket} socket - Active socket.io client connection.
 */
  useEffect(() => {
    if (socket && campaignId) {
      joinCampaign(campaignId);
      console.log(`📡 Joined socket room for campaign ${campaignId}`);
    }
  }, [socket, campaignId, joinCampaign]);

/**
 * Auto-scrolls the chat window to bottom whenever new messages arrive.
 */
  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

 /**
 * Sends a chat message via socket.io to the current campaign room.
 * 
 * @param {Event} e - Form submit event.
 */
  const handleSend = useCallback((e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const username = user?.username || user?.displayName || 'Unknown Player';

    console.log('📤 Sending chat message:', {
      campaignId,
      username,
      message: input.trim(),
      type: 'chat',
    });

    socket.emit(SOCKET_EVENTS.CHAT_MESSAGE, {
      campaignId,
      username,
      message: input.trim(),
      type: 'chat',
    });

    setInput('');
  }, [campaignId, input, socket, user]);

/**
 * Handles dice roll, plays sound effect, and emits roll result via socket.
 * 
 * @param {Object} params
 * @param {string} params.dice - Dice type string (e.g., "d20").
 * @param {number} params.quantity - Number of dice rolled.
 * @param {number} params.modifier - Modifier to apply to roll total.
 */
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
        <div className="mt-8">
          <DiceRoller onRoll={handleRoll} />
        </div>
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
        <button
          onClick={() => socket.emit('debug_ping', { message: 'Ping from Tabletop!' })}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-4"
        >
          Send Debug Ping
        </button>
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
    </div>
  );
};

export default Tabletop;
