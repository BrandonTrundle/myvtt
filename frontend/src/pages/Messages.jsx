import React, { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';
import MessageForm from '../components/MessageForm';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showComposer, setShowComposer] = useState(false);

  const fetchMessages = async () => {
    try {
      const res = await apiFetch('/api/messages');
      const data = await res.json();
      if (res.ok) setMessages(data);
    } catch (err) {
      console.error('❌ Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // TODO: Replace this with polling or WebSockets for real-time updates in the future
    fetchMessages();
  }, []);

  const handleSelectMessage = async (msg) => {
    setSelectedMessage(msg);

    if (!msg.isRead) {
      try {
        await apiFetch(`/api/messages/${msg._id}/read`, {
          method: 'PATCH',
        });

        setMessages((prev) =>
          prev.map((m) =>
            m._id === msg._id ? { ...m, isRead: true } : m
          )
        );
      } catch (err) {
        console.error('❌ Failed to mark as read:', err);
      }
    }
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
                setSelectedMessage(null);      // ✅ go back to inbox view
                setShowComposer(false);        // ✅ hide composer
                fetchMessages();               // ✅ refresh inbox
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
      onClick={(e) => {
        e.stopPropagation(); // prevent opening the message
        const confirmDelete = window.confirm('Delete this message?');
        if (confirmDelete) {
          apiFetch(`/api/messages/${msg._id}`, { method: 'DELETE' })
            .then((res) => {
              if (res.ok) {
                setMessages((prev) => prev.filter((m) => m._id !== msg._id));
              } else {
                alert('Failed to delete message.');
              }
            })
            .catch((err) => {
              console.error('❌ Failed to delete message:', err);
              alert('Error deleting message.');
            });
        }
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
