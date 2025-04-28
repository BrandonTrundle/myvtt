/**
 * Author: Brandon Trundle
 * File Name: characterSubmitHandler.js
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Handles submission of character creation and character editing forms to the ArcanaTable backend.
 * 
 * Behavior:
 * - Determines whether to create a new character or update an existing one.
 * - Sends the character data to the appropriate API endpoint.
 * - Parses server responses and handles errors gracefully.
 * - Optionally calls a success callback upon successful submission.
 * 
 * Exports:
 * - submitCharacterForm: Function to submit character data with dynamic POST or PUT logic.
 */

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api'; // Base URL for API requests

/**
 * Submits a character form payload to the server, creating or updating a character record.
 * 
 * Behavior:
 * - Uses POST method if creating a new character.
 * - Uses PUT method if updating an existing character.
 * - Automatically attaches Authorization headers using the user's token.
 * - Parses server responses and handles both JSON and error cases.
 * - Executes an optional onSaveSuccess callback after successful save.
 * 
 * @param {Object} payload - The character data to submit
 * @param {Function|null} [onSaveSuccess=null] - Optional callback function to run after successful submission
 * @param {string|null} [characterId=null] - Optional character ID to update an existing character
 * @throws {Error} - If network issues occur or server returns a non-2xx status
 */
const submitCharacterForm = async (payload, onSaveSuccess = null, characterId = null) => {
  try {
    const method = characterId ? 'PUT' : 'POST';
    const url = characterId
      ? `${API_BASE}/characters/${characterId}`
      : `${API_BASE}/characters`;

    console.log('📡 Submitting to:', url);
    console.log('📥 Request payload:', payload);

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(payload),
    });

    const raw = await response.text();
    console.log('📩 Raw response:', raw);

    let data;
    try {
      data = JSON.parse(raw);
      console.log('✅ Parsed response:', data);
    } catch (err) {
      console.warn('⚠️ Could not parse JSON:', err);
      throw new Error('Non-JSON response from backend');
    }

    if (!response.ok) {
      console.error('🛑 Character save failed:', data);
      alert(`Error: ${data.message || 'Failed to save character.'}`);
      return;
    }

    console.log('✅ Character saved successfully.');

    // ✨ Automatically trigger onSaveSuccess if provided
    if (typeof onSaveSuccess === 'function') {
      onSaveSuccess();
    }
  } catch (error) {
    console.error('🚨 Network error during character submission:', error);
    alert('Network error — please check your connection or try again.');
  }
};

export default submitCharacterForm;
