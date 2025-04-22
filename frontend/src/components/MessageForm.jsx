import React, { useState, useCallback } from 'react';
import { apiFetch } from '../utils/api';

const MessageForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    toUsername: '',
    subject: '',
    body: '',
  });

  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus(null);

    try {
      const res = await apiFetch('/api/messages', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('✅ Message sent!');
        setFormData({ toUsername: '', subject: '', body: '' });
        onSuccess?.(); // Optional chaining
      } else {
        setStatus(data.message || '❌ Error sending message.');
      }
    } catch (err) {
      console.error('❌ Failed to send message:', err);
      setStatus('Something went wrong.');
    } finally {
      setSending(false);
    }
  }, [formData, onSuccess]);

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg bg-white border border-arcanabrown p-6 rounded shadow space-y-4 text-arcanadeep"
    >
      <h2 className="text-xl font-bold">✉️ Send a Message</h2>

      <input
        name="toUsername"
        value={formData.toUsername}
        onChange={handleChange}
        placeholder="Recipient username"
        required
        className="w-full p-2 border rounded"
      />

      <input
        name="subject"
        value={formData.subject}
        onChange={handleChange}
        placeholder="Subject"
        required
        className="w-full p-2 border rounded"
      />

      <textarea
        name="body"
        value={formData.body}
        onChange={handleChange}
        placeholder="Message body"
        rows="5"
        required
        className="w-full p-2 border rounded"
      />

      <button
        type="submit"
        disabled={sending}
        className="bg-arcanared text-white px-4 py-2 rounded hover:bg-arcanabrown transition"
      >
        {sending ? 'Sending...' : 'Send Message'}
      </button>

      {status && (
        <p className={`text-sm mt-2 ${status.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
          {status}
        </p>
      )}
    </form>
  );
};

export default MessageForm;
