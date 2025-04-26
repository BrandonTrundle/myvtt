// utils/characterSubmitHandler.js

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

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
