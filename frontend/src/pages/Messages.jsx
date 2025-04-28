/**
 * Author: Brandon Trundle
 * File Name: Messages.jsx
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Displays the user's inbox for ArcanaTable, allowing viewing, composing, refreshing, and deleting messages.
 * 
 * Behavior:
 * - Fetches and displays all received messages.
 * - Allows users to view full message details and mark them as read.
 * - Allows users to compose and send new messages.
 * - Supports deleting individual messages.
 * 
 * Props:
 * - None (page component using internal hooks and state).
 */

import React, { useState } from 'react'; // React library and hook for managing local state
import MessageForm from '../components/PageComponents/Messaging/MessageForm'; // Component for composing and sending a new message
import { useMessages } from '../components/PageComponents/Messaging/hooks/useMessages'; // Custom hook for managing user messages

/**
 * Messages Component
 * 
 * Renders the user's inbox, allowing message viewing, composing, refreshing, and deleting.
 * 
 * @returns {JSX.Element} - The rendered messages page
 */
const Messages = () => {
  const {
    messages,
    loading,
    fetchMessages,
    markAsRead,
    deleteMessage,
  } = useMessages();

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showComposer, setShowComposer] = useState(false);
  
/**
 * Selects a message to view its full content.
 * 
 * Behavior:
 * - Marks the message as read if it was unread.
 * 
 * @param {Object} msg - The selected message object
 */
  const handleSelectMessage = async (msg) => {
    setSelectedMessage(msg);
    if (!msg.isRead) await markAsRead(msg._id);
  };

  return (
    <div className="bg-parchment min-h-screen px-6 py-10 text-arcanadeep">
      <div className="flex justify-between items-center mb-6 max-w-3xl">
        <h1 className="text-3xl font-bold">📬 Inbox</h1>
        <div className="flex gap-2">
          <button
            onClick={fetchMessages}
            className="bg-white border border-arcanadeep text-arcanadeep px-3 py-1 rounded text-sm hover:bg-arcanabrown hover:text-white transition"
          >
            Refresh
          </button>
          <button
            onClick={() => setShowComposer((prev) => !prev)}
            className="bg-arcanared text-white px-3 py-1 rounded text-sm hover:bg-arcanabrown transition"
          >
            {showComposer ? 'Cancel' : 'Compose'}
          </button>
        </div>
      </div>

      {showComposer && (
        <div className="mb-6 max-w-3xl">
          <MessageForm
            onSuccess={() => {
              setSelectedMessage(null);
              setShowComposer(false);
              fetchMessages();
            }}
          />
        </div>
      )}

      {selectedMessage ? (
        <div className="max-w-3xl bg-white p-6 rounded shadow border border-arcanabrown">
          <button
            className="text-sm text-arcanared underline mb-4 hover:text-arcanabrown"
            onClick={() => setSelectedMessage(null)}
          >
            ← Back to inbox
          </button>

          <h2 className="text-xl font-bold">{selectedMessage.subject}</h2>
          <p className="text-sm text-gray-500 mb-2">
            From <strong>{selectedMessage.senderName}</strong> —{' '}
            {new Date(selectedMessage.sentAt).toLocaleString()}
          </p>
          <p className="whitespace-pre-wrap mt-4 text-gray-800">
            {selectedMessage.body}
          </p>
        </div>
      ) : loading ? (
        <p>Loading messages...</p>
      ) : messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <ul className="space-y-4 max-w-3xl">
          {messages.map((msg) => (
            <li
              key={msg._id}
              className={`p-4 rounded shadow border relative ${
                msg.isRead ? 'bg-white' : 'bg-yellow-50 border-yellow-300'
              }`}
              onClick={() => handleSelectMessage(msg)}
            >
              <button
                className="absolute top-2 right-2 text-xs text-arcanared underline hover:text-arcanabrown"
                onClick={async (e) => {
                  e.stopPropagation();
                  const confirmed = window.confirm('Delete this message?');
                  if (confirmed) await deleteMessage(msg._id);
                }}
              >
                Delete
              </button>

              <div className="flex justify-between">
                <span className="font-semibold">{msg.senderName}</span>
                <span className="text-sm text-gray-500">
                  {new Date(msg.sentAt).toLocaleString()}
                </span>
              </div>
              <h2 className="text-lg font-bold">{msg.subject}</h2>
              <p className="text-sm text-gray-700 mt-1">
                {msg.body.slice(0, 120)}
                {msg.body.length > 120 ? '...' : ''}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Messages;
