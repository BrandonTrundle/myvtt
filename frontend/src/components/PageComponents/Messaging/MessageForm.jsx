/**
 * Author: Brandon Trundle
 * File Name: MessageForm.jsx
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Displays a form for sending in-app messages to other users on ArcanaTable.
 * Handles form input, form submission, API interaction, success feedback, and error states.
 * 
 * Props:
 * - onSuccess (function, optional): Callback triggered after a successful message send.
 */

import React, { useState, useCallback } from 'react'; // React core library and hooks
import { apiFetch } from '../../../utils/api'; // Utility for API interactions

/**
 * MessageForm Component
 * 
 * Renders a form allowing users to send messages by specifying:
 * - Recipient username
 * - Subject
 * - Message body
 * 
 * Handles:
 * - Input state management
 * - Sending message data to backend API
 * - Loading and success/error feedback
 * 
 * @param {Function} onSuccess - Optional callback after successful form submission.
 */
const MessageForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    toUsername: '',
    subject: '',
    body: '',
  });
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  /**
 * Updates form field values based on user input.
 * 
 * @param {Event} e - Input change event.
 */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

/**
 * Submits the message form to the backend API.
 * Resets form on success and calls the onSuccess callback if provided.
 * 
 * @param {Event} e - Form submit event.
 */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus(null);
  
    try {
      await apiFetch('/messages', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
  
      setStatus('✅ Message sent!');
      setFormData({ toUsername: '', subject: '', body: '' });
      onSuccess?.(); // Optional chaining
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
